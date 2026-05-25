import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import {
  Heart, Send, AlertTriangle, X, Shield, Users, MessageCircle,
  Loader2, ChevronRight, Lock, Globe, UserCircle2, Dot
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type MessageType = {
  id: string;
  text: string;
  username: string;
  createdAt: string;
  source: "self" | "other";
  status: "pending" | "sent";
};

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

type UserProfile = {
  name: string;
  age: string;
  gender: string;
};

type OnlineUser = {
  username: string;
  socketId: string;
};

type Tab = {
  id: string;         // "group" | dm partner username
  label: string;
  type: "group" | "dm";
  unread: number;
};

// ─── Constants ─────────────────────────────────────────────────────────────────

const CHAT_SERVER_URL = "https://anonmind-space-backend.onrender.com";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-Binary" },
  { value: "prefer-not", label: "Prefer not to say" },
];

const URGENT_KEYWORDS = ["suicide", "kill myself", "die", "end my life", "hurt myself"];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const uid = (prefix = "msg") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const sortMsgs = (msgs: MessageType[]) =>
  [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

const isUrgent = (text: string) =>
  URGENT_KEYWORDS.some((w) => text.toLowerCase().includes(w));

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

const dmRoomId = (a: string, b: string) =>
  [a, b].sort().join("__dm__");

// ─── Avatar color from username ─────────────────────────────────────────────

const AVATAR_COLORS = [
  "from-purple-500 to-indigo-500",
  "from-cyan-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-green-500",
  "from-sky-500 to-blue-500",
];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─── Small Avatar ──────────────────────────────────────────────────────────────

const Avatar = ({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) => {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
      {name[0]?.toUpperCase()}
    </div>
  );
};

// ─── Message Bubble ────────────────────────────────────────────────────────────

const MessageBubble = ({
  msg,
  showAvatar,
  onUsernameClick,
  myName,
}: {
  msg: MessageType;
  showAvatar: boolean;
  onUsernameClick?: (username: string) => void;
  myName: string;
}) => {
  const isSelf = msg.source === "self";
  return (
    <div className={`flex gap-2 mb-1 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar placeholder to keep alignment */}
      <div className="w-7 shrink-0 flex items-end">
        {showAvatar && !isSelf && <Avatar name={msg.username} />}
      </div>
      <div className={`flex flex-col max-w-[72%] md:max-w-[58%] ${isSelf ? "items-end" : "items-start"}`}>
        {showAvatar && (
          <button
            onClick={() => !isSelf && onUsernameClick?.(msg.username)}
            className={`text-xs font-medium mb-1 px-1 transition-colors ${isSelf
              ? "text-muted-foreground cursor-default"
              : "text-primary/80 hover:text-primary cursor-pointer"
              }`}
          >
            {isSelf ? "You" : msg.username}
          </button>
        )}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${isSelf
            ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl rounded-br-sm"
            : "bg-card border border-border/60 text-foreground rounded-2xl rounded-bl-sm"
            }`}
        >
          {msg.text}
        </div>
        <div className="flex items-center gap-1 mt-0.5 px-1">
          <span className="text-xs text-muted-foreground/50">{fmtTime(msg.createdAt)}</span>
          {isSelf && msg.status === "pending" && (
            <Loader2 className="w-2.5 h-2.5 text-muted-foreground/40 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Message List ──────────────────────────────────────────────────────────────

const MessageList = ({
  messages,
  myName,
  onUsernameClick,
  emptyText,
  isConnecting,
}: {
  messages: MessageType[];
  myName: string;
  onUsernameClick?: (username: string) => void;
  emptyText: string;
  isConnecting: boolean;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isConnecting && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Connecting...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Heart className="w-7 h-7 text-primary/50" />
        </div>
        <p className="text-muted-foreground text-sm max-w-xs">{emptyText}</p>
      </div>
    );
  }

  const items: React.ReactNode[] = [];
  let lastDate = "";
  let lastSender = "";

  messages.forEach((msg, i) => {
    const d = fmtDate(msg.createdAt);
    if (d !== lastDate) {
      lastDate = d;
      lastSender = "";
      items.push(
        <div key={`date-${d}-${i}`} className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border/30" />
          <span className="text-muted-foreground/60 text-xs px-2">{d}</span>
          <div className="flex-1 h-px bg-border/30" />
        </div>
      );
    }

    const showAvatar = msg.username !== lastSender;
    lastSender = msg.username;

    items.push(
      <MessageBubble
        key={msg.id}
        msg={msg}
        showAvatar={showAvatar}
        onUsernameClick={onUsernameClick}
        myName={myName}
      />
    );
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth">
      {items}
      <div ref={bottomRef} />
    </div>
  );
};

// ─── Input Bar ─────────────────────────────────────────────────────────────────

const InputBar = ({
  onSend,
  disabled,
  placeholder,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder: string;
}) => {
  const [draft, setDraft] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    if (!draft.trim() || disabled) return;
    onSend(draft.trim());
    setDraft("");
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.focus();
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="shrink-0 border-t border-border/40 bg-card/20 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Shield className="w-3 h-3 text-primary/50" />
        <p className="text-muted-foreground/50 text-xs">Be kind · Safe space · No personal info</p>
      </div>
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-background/80 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none disabled:opacity-40 leading-relaxed transition-all"
          style={{ minHeight: 44, maxHeight: 140 }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 140) + "px";
          }}
        />
        <button
          onClick={send}
          disabled={!draft.trim() || disabled}
          className="w-11 h-11 bg-gradient-to-br from-primary to-support rounded-xl flex items-center justify-center shadow-md shadow-primary/20 hover:shadow-primary/35 hover:scale-105 active:scale-95 transition-all disabled:opacity-35 disabled:scale-100 disabled:shadow-none shrink-0"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
      <p className="text-muted-foreground/30 text-xs text-center mt-1.5">Enter to send · Shift+Enter for new line</p>
    </div>
  );
};

// ─── Crisis Dialog ──────────────────────────────────────────────────────────────

const CrisisDialog = ({ onSend, onCancel }: { onSend: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 shadow-2xl">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-foreground font-semibold mb-1">Are you in crisis?</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Your life matters. Please reach out for immediate help.</p>
        </div>
      </div>
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 space-y-1.5 text-sm">
        <p className="text-red-300 font-medium mb-2">📞 Immediate Help (India)</p>
        <p className="text-muted-foreground"><span className="text-foreground font-medium">iCall:</span> 9152987821</p>
        <p className="text-muted-foreground"><span className="text-foreground font-medium">Vandrevala:</span> 1860-2662-345 (24/7)</p>
        <p className="text-muted-foreground"><span className="text-foreground font-medium">NIMHANS:</span> 080-46110007</p>
      </div>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 border border-border text-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-border/30 transition-colors">Edit Message</button>
        <button onClick={onSend} className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">Send Anyway</button>
      </div>
    </div>
  </div>
);

// ─── Online Users Sidebar ───────────────────────────────────────────────────────

const OnlineUsersSidebar = ({
  users,
  myName,
  activeTab,
  onOpenDM,
}: {
  users: OnlineUser[];
  myName: string;
  activeTab: string;
  onOpenDM: (username: string) => void;
}) => {
  const others = users.filter((u) => u.username !== myName);
  return (
    <div className="w-56 shrink-0 border-l border-border/40 bg-card/20 flex flex-col">
      <div className="px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-foreground">Online ({users.length})</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {/* Yourself */}
        <div className="px-3 py-2 flex items-center gap-2.5">
          <Avatar name={myName} />
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{myName}</p>
            <p className="text-xs text-primary/60">You</p>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-1">
            <p className="px-4 text-xs text-muted-foreground/50 mb-1 uppercase tracking-wider">Others</p>
            {others.map((u) => {
              const isActive = activeTab === u.username;
              return (
                <button
                  key={u.socketId}
                  onClick={() => onOpenDM(u.username)}
                  className={`w-full px-3 py-2 flex items-center gap-2.5 rounded-lg mx-1 transition-all text-left ${isActive
                    ? "bg-primary/15 border border-primary/20"
                    : "hover:bg-border/30"
                    }`}
                  title={`Private message ${u.username}`}
                >
                  <div className="relative">
                    <Avatar name={u.username} />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-background rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{u.username}</p>
                    <p className="text-xs text-muted-foreground/60">Click to DM</p>
                  </div>
                  <Lock className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {others.length === 0 && (
          <div className="px-4 py-6 text-center">
            <UserCircle2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground/50">No one else online yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Tab Bar ───────────────────────────────────────────────────────────────────

const TabBar = ({
  tabs,
  activeTab,
  onSelect,
  onClose,
}: {
  tabs: Tab[];
  activeTab: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) => (
  <div className="shrink-0 flex items-end gap-1 px-3 pt-2 border-b border-border/40 bg-card/30 overflow-x-auto">
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <div
          key={tab.id}
          className={`group flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-sm font-medium cursor-pointer transition-all shrink-0 border border-b-0 ${isActive
            ? "bg-background border-border/60 text-foreground"
            : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-border/20"
            }`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.type === "group" ? (
            <Globe className="w-3.5 h-3.5 text-primary/70" />
          ) : (
            <Lock className="w-3 h-3 text-muted-foreground/60" />
          )}
          <span className="max-w-[100px] truncate">{tab.label}</span>
          {tab.unread > 0 && (
            <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
              {tab.unread > 9 ? "9+" : tab.unread}
            </span>
          )}
          {tab.type === "dm" && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main Chat Room ─────────────────────────────────────────────────────────────

const ChatRoom = ({ profile, onLeave }: { profile: UserProfile; onLeave: () => void }) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  // messages keyed by tab id ("group" or dm partner username)
  const [messageStore, setMessageStore] = useState<Record<string, MessageType[]>>({ group: [] });

  const [tabs, setTabs] = useState<Tab[]>([{ id: "group", label: "Support Room", type: "group", unread: 0 }]);
  const [activeTab, setActiveTab] = useState("group");

  const [crisis, setCrisis] = useState<{ text: string; tabId: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const myName = profile.name;

  // ── Socket setup ────────────────────────────────────────────────────────────

  useEffect(() => {
    const socket = io(CHAT_SERVER_URL, { transports: ["websocket"], reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionState("connected");
      socket.emit("register", { username: myName });
    });

    // ✅ ADD THIS — handles case where socket was already connected before listener attached
    if (socket.connected) {
      setConnectionState("connected");
      socket.emit("register", { username: myName });
    }

    socket.on("reconnect", () => {
      socket.emit("register", { username: myName });
    });
    socket.on("disconnect", () => setConnectionState("disconnected"));
    socket.on("connect_error", () => setConnectionState("error"));

    // Online users list
    socket.on("onlineUsers", (users: OnlineUser[]) => setOnlineUsers(users));

    // Group messages
    socket.on("receiveMessage", (data: any) => {
      if (!data?.text) return;
      addIncoming("group", data);
    });

    // Private DM
    socket.on("receiveDM", (data: any) => {
      if (!data?.text || !data?.from) return;
      const tabId = data.from === myName ? data.to : data.from;
      addIncoming(tabId, { ...data, username: data.from });
      // Open tab if not exists
      ensureDMTab(data.from === myName ? data.to : data.from);
    });

    // Load history
    fetch(`${CHAT_SERVER_URL}/messages`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data: any[]) => {
        if (!Array.isArray(data)) return;
        const initial = data.map((m) => ({
          id: uid("h"),
          text: m.text || "",
          username: m.username || "Anonymous",
          createdAt: m.createdAt ?? new Date().toISOString(),
          source: m.username === myName ? "self" as const : "other" as const,
          status: "sent" as const,
        }));
        setMessageStore((prev) => ({ ...prev, group: sortMsgs(initial) }));
      })
      .catch(() => setLoadError("Could not load history. Showing live messages only."));

    return () => {
      socket.off("connect"); socket.off("disconnect"); socket.off("connect_error");
      socket.off("onlineUsers"); socket.off("receiveMessage"); socket.off("receiveDM");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const addIncoming = useCallback((tabId: string, data: any) => {
    const newMsg: MessageType = {
      id: uid("srv"),
      text: data.text,
      username: data.username || "Anonymous",
      createdAt: data.createdAt ?? new Date().toISOString(),
      source: (data.username === myName ? "self" : "other") as "self" | "other",
      status: "sent",
    };

    setMessageStore((prev) => {
      const existing = prev[tabId] ?? [];
      // Dedupe / upgrade pending
      const updated = existing.map((m) =>
        m.status === "pending" && m.text.trim() === data.text?.trim()
          ? { ...m, status: "sent" as const, createdAt: data.createdAt ?? m.createdAt }
          : m
      );
      const exists = updated.some((m) => m.text === data.text && m.createdAt === data.createdAt);
      return { ...prev, [tabId]: sortMsgs(exists ? updated : [...updated, newMsg]) };
    });

    // Increment unread if not active tab
    setActiveTab((current) => {
      if (current !== tabId) {
        setTabs((t) => t.map((tab) => tab.id === tabId ? { ...tab, unread: tab.unread + 1 } : tab));
      }
      return current;
    });
  }, [myName]);

  const ensureDMTab = useCallback((username: string) => {
    setTabs((prev) => {
      if (prev.find((t) => t.id === username)) return prev;
      return [...prev, { id: username, label: `@ ${username}`, type: "dm", unread: 0 }];
    });
    setMessageStore((prev) => prev[username] ? prev : { ...prev, [username]: [] });
  }, []);

  const openDM = useCallback((username: string) => {
    ensureDMTab(username);
    setActiveTab(username);
    setTabs((t) => t.map((tab) => tab.id === username ? { ...tab, unread: 0 } : tab));
  }, [ensureDMTab]);

  const selectTab = (id: string) => {
    setActiveTab(id);
    setTabs((t) => t.map((tab) => tab.id === id ? { ...tab, unread: 0 } : tab));
  };

  const closeTab = (id: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== id));
    if (activeTab === id) setActiveTab("group");
  };

  // ── Send ────────────────────────────────────────────────────────────────────

  const doSend = (text: string, tabId: string) => {
    if (!socketRef.current || connectionState !== "connected") return;

    const pending: MessageType = {
      id: uid("local"),
      text,
      username: myName,
      createdAt: new Date().toISOString(),
      source: "self",
      status: "pending",
    };
    setMessageStore((prev) => ({
      ...prev,
      [tabId]: sortMsgs([...(prev[tabId] ?? []), pending]),
    }));

    if (tabId === "group") {
      socketRef.current.emit("sendMessage", { text, username: myName });
    } else {
      socketRef.current.emit("sendDM", { to: tabId, text, from: myName });
    }
  };

  const handleSend = (text: string) => {
    if (isUrgent(text)) {
      setCrisis({ text, tabId: activeTab });
      return;
    }
    doSend(text, activeTab);
  };

  // ── Connection badge ────────────────────────────────────────────────────────

  const connBadge = () => {
    switch (connectionState) {
      case "connected": return (
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Live · {onlineUsers.length} online
        </span>
      );
      case "connecting": return (
        <span className="flex items-center gap-1.5 text-xs text-yellow-400">
          <Loader2 className="w-3 h-3 animate-spin" /> Connecting...
        </span>
      );
      default: return (
        <span className="flex items-center gap-1.5 text-xs text-red-400">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> Disconnected
        </span>
      );
    }
  };

  const currentMessages = messageStore[activeTab] ?? [];
  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ── Top Header ── */}
      <div className="shrink-0 border-b border-border/40 bg-card/50 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-support rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-foreground font-semibold text-sm leading-tight">SafeSpace</h1>
            {connBadge()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-background/60 border border-border/40 rounded-lg px-2.5 py-1.5">
            <Avatar name={myName} size="sm" />
            <span className="text-foreground font-medium">{myName}</span>
          </div>
          <button
            onClick={onLeave}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-border/30 transition-colors"
            title="Leave"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <TabBar tabs={tabs} activeTab={activeTab} onSelect={selectTab} onClose={closeTab} />

      {/* ── Error Banner ── */}
      {loadError && (
        <div className="shrink-0 bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <p className="text-yellow-300 text-xs">{loadError}</p>
        </div>
      )}

      {/* ── Main Content: messages + sidebar ── */}
      <div className="flex flex-1 min-h-0">
        {/* Chat panel */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Tab context banner */}
          {currentTab?.type === "dm" && (
            <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/5 border-b border-primary/10">
              <Lock className="w-3.5 h-3.5 text-primary/60" />
              <p className="text-xs text-primary/70">
                Private conversation with <span className="font-semibold text-primary">{activeTab}</span> — only visible to you two
              </p>
            </div>
          )}

          <MessageList
            messages={currentMessages}
            myName={myName}
            onUsernameClick={currentTab?.type === "group" ? openDM : undefined}
            emptyText={
              currentTab?.type === "group"
                ? "The room is quiet. Be the first to share — someone might really need to hear it."
                : `Start a private conversation with ${activeTab}. Everything here is between just you two.`
            }
            isConnecting={connectionState === "connecting"}
          />

          <InputBar
            onSend={handleSend}
            disabled={connectionState !== "connected"}
            placeholder={
              currentTab?.type === "group"
                ? "Share how you're feeling, or offer support..."
                : `Message ${activeTab} privately...`
            }
          />
        </div>

        {/* Online users sidebar */}
        <OnlineUsersSidebar
          users={onlineUsers}
          myName={myName}
          activeTab={activeTab}
          onOpenDM={openDM}
        />
      </div>

      {/* Crisis Dialog */}
      {crisis && (
        <CrisisDialog
          onSend={() => { doSend(crisis.text, crisis.tabId); setCrisis(null); }}
          onCancel={() => setCrisis(null)}
        />
      )}
    </div>
  );
};

// ─── Onboarding ─────────────────────────────────────────────────────────────────

const OnboardingScreen = ({ onEnter }: { onEnter: (p: UserProfile) => void }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"landing" | "form">("landing");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter a name";
    if (!age || isNaN(Number(age)) || Number(age) < 18) e.age = "You must be 18 or older";
    if (!gender) e.gender = "Please select a gender";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  if (step === "landing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-support/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-support rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-support to-healing bg-clip-text text-transparent">
            Support Rooms
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            A safe, anonymous space where real people support each other. No judgment. No real names. Just genuine human connection.
          </p>
          <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-support rounded-l-2xl" />
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="text-foreground font-semibold text-sm mb-1">About Mental Health & This Space</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Mental health affects 1 in 4 people worldwide — it's not weakness, it's human. Whether you're dealing with anxiety, depression, loneliness, or just a rough patch, you don't have to face it alone.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Shield, text: "100% Anonymous", sub: "No account needed" },
                { icon: Users, text: "Real People", sub: "Peer-to-peer support" },
                { icon: MessageCircle, text: "Moderated", sub: "Safe environment" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="bg-background/50 rounded-xl p-3 text-center">
                  <Icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <p className="text-foreground text-xs font-medium">{text}</p>
                  <p className="text-muted-foreground text-xs">{sub}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setStep("form")}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-support text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200"
          >
            Enter Support Room <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="text-muted-foreground text-xs mt-4">By entering, you agree to be kind and supportive to others.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-support rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Join Anonymously</h2>
          <p className="text-muted-foreground text-sm">Choose any name — no real identity needed.</p>
        </div>
        <div className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Anonymous Name <span className="text-muted-foreground font-normal">(e.g. "BlueSky", "Wanderer")</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
              placeholder="Choose any name..."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
          </div>
          {/* Age */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Age <span className="text-muted-foreground font-normal">(18+ only)</span>
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => { setAge(e.target.value); setErrors((p) => ({ ...p, age: "" })); }}
              placeholder="Your age"
              min={18}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {errors.age && <p className="text-red-400 text-xs mt-1.5">{errors.age}</p>}
          </div>
          {/* Gender */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setGender(value); setErrors((p) => ({ ...p, gender: "" })); }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${gender === value
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-background border-border text-muted-foreground hover:border-primary/40"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-red-400 text-xs mt-1.5">{errors.gender}</p>}
          </div>
          <button
            onClick={() => validate() && onEnter({ name: name.trim(), age, gender })}
            className="w-full bg-gradient-to-r from-primary to-support text-white font-semibold py-3.5 rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Enter the Room
          </button>
          <p className="text-muted-foreground/60 text-xs text-center mt-4 leading-relaxed">
            🔒 Your details stay in this session only and are never stored with messages.
          </p>
        </div>
        <button onClick={() => setStep("landing")} className="mt-4 text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mx-auto transition-colors">
          ← Back
        </button>
      </div>
    </div>
  );
};

// ─── Root ───────────────────────────────────────────────────────────────────────

const ChatRooms = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  if (!profile) return <OnboardingScreen onEnter={setProfile} />;
  return <ChatRoom profile={profile} onLeave={() => setProfile(null)} />;
};

export default ChatRooms;

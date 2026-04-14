export interface ClientOptions {
  token?: string;
  safety?: 'strict' | 'moderate' | 'permissive';
  rateLimitMode?: 'conservative' | 'balanced' | 'aggressive';
  autoCooldown?: boolean;
  humanEmulation?: boolean;
  auditLogging?: boolean;
  riskWarnings?: boolean;
  emergencyStop?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

export interface RiskAssessment {
  risk: number;
  factors: {
    actionType: number;
    frequency: number;
    content: number;
    timing: number;
    volume: number;
  };
  allowed: boolean;
}

export interface AuditLogEntry {
  timestamp: number;
  action: string;
  details?: any;
  type: 'action' | 'warning' | 'emergency';
  risk?: string;
  factors?: any;
}

export interface RateLimitStats {
  requestsLastMinute: number;
  totalHistorySize: number;
  currentLimit: number;
}

export interface LoggerOptions {
  level?: 'error' | 'warn' | 'info' | 'debug';
  enableConsole?: boolean;
  enableFile?: boolean;
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export interface Guild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export interface Channel {
  id: string;
  type: number;
  guild_id?: string;
  name?: string;
  topic?: string;
  nsfw?: boolean;
  last_message_id?: string;
}

export interface Message {
  id: string;
  channel_id: string;
  author: User;
  content: string;
  timestamp: string;
  edited_timestamp?: string;
  tts: boolean;
  mention_everyone: boolean;
  mentions: User[];
  mention_roles: string[];
  attachments: any[];
  embeds: any[];
  reactions?: any[];
  pinned?: boolean;
}

export interface Relationship {
  id: string;
  user: User;
  type: number;
}

export interface Connection {
  id: string;
  name: string;
  type: string;
  revoked: boolean;
  integrations?: any[];
  verified: boolean;
  friend_sync: boolean;
  show_activity: boolean;
  visibility: number;
}

-- GREEN FAD — Repli sessions D1 (0004)
-- Le quota d'écritures KV du plan gratuit peut être épuisé en journée ;
-- les sessions d'administration ne doivent jamais être bloquées par un quota.
-- auth.ts écrit dans KV en priorité, puis replie sur cette table si besoin.
CREATE TABLE IF NOT EXISTS sessions_backup (
  id         TEXT PRIMARY KEY,
  data       TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_backup_expires ON sessions_backup (expires_at);

// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

export function isMuted(muteExpiresAt: undefined | number): boolean {
  return Boolean(muteExpiresAt && Date.now() < muteExpiresAt);
}

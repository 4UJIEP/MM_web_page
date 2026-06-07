// маппинг user_info.id → внутренний id роли

export const ROLE_ID_MAP: Record<string, string> = {
    // user_info.id → parent.id
    '11111111-1111-1111-1111-111111111111': 'a0a0a0a0-0000-0000-0000-000000000001',
    // user_info.id → child.id
    '22222222-2222-2222-2222-222222222222': 'b0b0b0b0-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333': 'b0b0b0b0-0000-0000-0000-000000000002',
    // user_info.id → teacher.id
    '44444444-4444-4444-4444-444444444444': 'c0c0c0c0-0000-0000-0000-000000000001',
};

export function getRoleId(userId: string): string | null {
    return ROLE_ID_MAP[userId] ?? null;
}
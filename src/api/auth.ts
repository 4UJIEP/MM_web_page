import { API_URL, apiFetch, tokenStorage } from "./apiClient";
import type { AuthUser } from "../context/AuthContext";
import { getRoleId } from "./roleIdMap";

// POST /auth/login
async function loginRequest(username: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.msg || "Неверный логин или пароль");
    }

    return response.json() as Promise<{ access_token: string; refresh_token: string }>;
}

// GET /users/user/<username>
async function fetchUserByUsername(username: string) {
    return apiFetch<{
        id: string;
        name: string;
        surname: string;
        patronymic: string | null;
        username: string;
        email: string | null;
        phone: string | null;
        user_type: string;
        avatar_url: string | null;
    }>(`/users/user/${username}`);
}

// Полный логин: получаем токены → получаем данные юзера → возвращаем AuthUser
export async function performLogin(username: string, password: string): Promise<AuthUser> {
    const { access_token, refresh_token } = await loginRequest(username, password);
    tokenStorage.save(access_token, refresh_token);

    const userData = await fetchUserByUsername(username);

    return {
        id: userData.id,
        name: userData.name ?? "",
        surname: userData.surname ?? "",
        patronymic: userData.patronymic ?? "",
        username: userData.username,
        email: userData.email ?? "",
        phone: userData.phone ?? undefined,
        role: userData.user_type as AuthUser["role"],
        avatarUrl: userData.avatar_url && !userData.avatar_url.includes('default')
            ? `https://xn----btbeiralcm3b5ag4hub.xn--p1ai${userData.avatar_url}`
            : undefined,
    };
}

// GET /users/ — все пользователи
export async function fetchTeachers() {
    const all = await apiFetch<any[]>('/users/');
    return all.filter(u => u.user_type === 'teacher');
}

// GET /parent/<role_id>/profile
export async function fetchParentProfile(userId: string) {
    const roleId = getRoleId(userId);
    if (!roleId) throw new Error('parent.id не найден для этого пользователя');
    return apiFetch<{
        id: string;
        name: string;
        surname: string;
        patronymic: string;
        phone: string;
        email: string;
        address: string;
        children_count: number;
    }>(`/parent/${roleId}/profile`);
}

// GET /parent/<role_id>/children
export async function fetchParentChildren(userId: string) {
    const roleId = getRoleId(userId);
    if (!roleId) throw new Error('parent.id не найден');
    return apiFetch<{
        child_id: string;
        name: string;
        surname: string;
        patronymic: string;
        phone: string;
        email: string;
        school_name: string;
        class_number: number;
        birth_day: string;
    }[]>(`/parent/${roleId}/children`);
}

// GET /parent/<role_id>/attendance
export async function fetchParentAttendance(userId: string) {
    const roleId = getRoleId(userId);
    if (!roleId) throw new Error('parent.id не найден');
    return apiFetch<any[]>(`/parent/${roleId}/attendance`);
}

// GET /child/<role_id>/profile
export async function fetchChildProfile(userId: string) {
    const roleId = getRoleId(userId);
    if (!roleId) throw new Error('child.id не найден');
    return apiFetch<{
        name: string;
        surname: string;
        patronymic: string;
        email: string;
        phone: string;
        school_name: string;
        class_number: number;
        day_of_week: string;
        time_set: string;
        name_course: string;
        parent_id: string;
        user_id: string;
    }>(`/child/${roleId}/profile`);
}

// GET /teacher/<role_id>/groups
export async function fetchTeacherGroups(userId: string) {
    const roleId = getRoleId(userId);
    if (!roleId) throw new Error('teacher.id не найден');
    return apiFetch<any[]>(`/teacher/${roleId}/groups`);
}

// GET /teacher/<role_id>/schedule
export async function fetchTeacherSchedule(userId: string) {
    const roleId = getRoleId(userId);
    if (!roleId) throw new Error('teacher.id не найден');
    return apiFetch<any[]>(`/teacher/${roleId}/schedule`);
}
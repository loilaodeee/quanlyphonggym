
export const STATUS = {
    accent: "status-badge status-badge--accent",
    warning: "status-badge status-badge--warning",
    muted: "status-badge status-badge--muted",
    danger: "status-badge status-badge--danger",
};


export function getScheduleStatusBadge(status) {
    if (status === "completed") return STATUS.muted;
    if (status === "canceled") return STATUS.danger;
    if (status === "booked") return STATUS.warning;
    return STATUS.warning;
}


export function getPackageStatusBadge(status) {
    if (status === "active") return STATUS.accent;
    if (status === "waiting") return STATUS.warning;
    return STATUS.danger;
}


export function getServiceStatusBadge(status) {
    if (status === "pending") return STATUS.accent;
    if (status === "using") return STATUS.warning;
    if (status === "used") return STATUS.muted;
    return STATUS.muted;
}


export function getEmployeeServiceStatusBadge(status) {
    if (status === "using") return STATUS.warning;
    return STATUS.muted;
}

export function getTrainerMemberStatusBadge(status) {
    if (status === "active") return STATUS.accent;
    return STATUS.muted;
}


export function getCheckoutStatusBadge(status) {
    if (status === "pending") return STATUS.warning;
    return STATUS.accent;
}


export function getAccountStatusBadge(isActive) {
    return isActive ? STATUS.accent : STATUS.danger;
}


export function getEmployeeMemberStatus(item) {
    if (item.status === "inactive") {
        return { label: "Không hoạt động", className: STATUS.danger };
    }
    if (item.end_date && new Date(item.end_date) < new Date()) {
        return { label: "Hết hạn gói", className: STATUS.danger };
    }
    return { label: "Đang hoạt động", className: STATUS.accent };
}

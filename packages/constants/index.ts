export const GST_RATES = [0, 5, 12, 18, 28] as const

export const INDIAN_STATES = [
    { code: "MH", name: "Maharashtra", gstCode: "27" },
    { code: "DL", name: "Delhi", gstCode: "07" },
    { code: "GJ", name: "Gujarat", gstCode: "24" },
    { code: "KA", name: "Karnataka", gstCode: "29" },
    { code: "TN", name: "Tamil Nadu", gstCode: "33" },
    { code: "UP", name: "Uttar Pradesh", gstCode: "09" },
    { code: "RJ", name: "Rajasthan", gstCode: "08" },
    { code: "WB", name: "West Bengal", gstCode: "19" },
] as const

export const DRUG_SCHEDULES = {
    OTC: "Over The Counter",
    H: "Schedule H",
    H1: "Schedule H1",
    X: "Schedule X",
    Narcotic: "Narcotic"
} as const

export const STAFF_ROLES = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
    billing_staff: "Billing Staff",
    view_only: "View Only"
} as const

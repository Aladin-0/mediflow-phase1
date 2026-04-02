export const GST_RATES = [0, 5, 12, 18, 28] as const

/**
 * Maps Indian state/UT names → 2-digit GST state code.
 * Source: GSTN registration portal state list (as of 2024).
 * Used to derive outletStateCode automatically from outletState.
 * Never set outletStateCode directly — always derive it through this map.
 */
export const STATE_CODES: Record<string, string> = {
    'Jammu & Kashmir':                          '01',
    'Himachal Pradesh':                         '02',
    'Punjab':                                   '03',
    'Chandigarh':                               '04',
    'Uttarakhand':                              '05',
    'Haryana':                                  '06',
    'Delhi':                                    '07',
    'Rajasthan':                                '08',
    'Uttar Pradesh':                            '09',
    'Bihar':                                    '10',
    'Sikkim':                                   '11',
    'Arunachal Pradesh':                        '12',
    'Nagaland':                                 '13',
    'Manipur':                                  '14',
    'Mizoram':                                  '15',
    'Tripura':                                  '16',
    'Meghalaya':                                '17',
    'Assam':                                    '18',
    'West Bengal':                              '19',
    'Jharkhand':                                '20',
    'Odisha':                                   '21',
    'Chhattisgarh':                             '22',
    'Madhya Pradesh':                           '23',
    'Gujarat':                                  '24',
    'Dadra & Nagar Haveli and Daman & Diu':     '26',
    'Maharashtra':                              '27',
    'Karnataka':                                '29',
    'Goa':                                      '30',
    'Lakshadweep':                              '31',
    'Kerala':                                   '32',
    'Tamil Nadu':                               '33',
    'Puducherry':                               '34',
    'Andaman & Nicobar Islands':                '35',
    'Telangana':                                '36',
    'Andhra Pradesh':                           '37',
    'Ladakh':                                   '38',
}

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
    OTC:        "OTC / General",
    G:          "Schedule G",
    H:          "Schedule H",
    H1:         "Schedule H1",
    X:          "Schedule X",
    C:          "Schedule C (Biological)",
    Narcotic:   "Narcotic (NDPS)",
    Ayurvedic:  "Ayurvedic / Herbal",
    Surgical:   "Surgical / Device",
    Cosmetic:   "Cosmetic",
    Veterinary: "Veterinary",
} as const

export const STAFF_ROLES = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
    billing_staff: "Billing Staff",
    view_only: "View Only"
} as const

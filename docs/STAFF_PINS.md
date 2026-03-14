# MediFlow — Staff PIN Quick Reference Card
> 🖨️ **Print this and keep at the pharmacy counter**

## Test Login
| Field | Value |
|---|---|
| Phone | `9876543210` |
| Password | `password123` |

---

## Staff PINs & Permissions

| # | Name | Role | PIN | Max Discount | Edit Rate | View Purchase Rates | Create Purchases | Access Reports |
|---|---|---|---|---|---|---|---|---|
| 1 | Rajesh Patil | super_admin | **0000** | 30% | ✅ | ✅ | ✅ | ✅ |
| 2 | Priya Sharma | admin | **1234** | 20% | ✅ | ✅ | ✅ | ✅ |
| 3 | Rahul Kumar | manager | **2345** | 15% | ❌ | ✅ | ✅ | ❌ |
| 4 | Sunita Devi | billing_staff | **4821** | 10% | ❌ | ❌ | ❌ | ❌ |
| 5 | Amit Singh | billing_staff | **3567** | 5% | ❌ | ❌ | ❌ | ❌ |

---

## Role Summary

| Role | Description |
|---|---|
| **super_admin** | Full access — all features, all outlets |
| **admin** | Manage staff, purchases, settings, reports |
| **manager** | Billing + purchases + override credit |
| **billing_staff** | Create bills only, limited discount |
| **view_only** | Read-only access to reports |

---

## Important Notes
- PINs are entered on the Billing screen before each bill
- PINs are **4 digits**
- Maximum discount is enforced automatically — billing staff cannot exceed their limit
- Only `super_admin` and `admin` can view purchase rates on screen

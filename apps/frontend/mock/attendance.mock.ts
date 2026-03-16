import { AttendanceRecord, AttendanceSummary, AttendanceStatus } from '../types';
import { mockStaff } from './staff.mock';

// Shift info (not on StaffMember type – kept locally)
export const STAFF_SHIFT_START: Record<string, string> = {
    'staff-001': '09:00',
    'staff-002': '09:00',
    'staff-003': '10:00',
    'staff-004': '09:00',
    'staff-005': '13:00',
};

export const STAFF_SHIFT_END: Record<string, string> = {
    'staff-001': '18:00',
    'staff-002': '18:00',
    'staff-003': '19:00',
    'staff-004': '18:00',
    'staff-005': '22:00',
};

function calcLate(checkInTime: string, shiftStart: string, graceMins: number = 10): { isLate: boolean; lateByMinutes: number } {
    const [sh, sm] = shiftStart.split(':').map(Number);
    const [ch, cm] = checkInTime.split(':').map(Number);
    const shiftStartMins = sh * 60 + sm;
    const checkInMins = ch * 60 + cm;
    const gracedStart = shiftStartMins + graceMins;
    if (checkInMins > gracedStart) {
        return { isLate: true, lateByMinutes: checkInMins - shiftStartMins };
    }
    return { isLate: false, lateByMinutes: 0 };
}

function calcHours(checkIn: string, checkOut: string): number {
    const [ih, im] = checkIn.split(':').map(Number);
    const [oh, om] = checkOut.split(':').map(Number);
    return parseFloat(((oh * 60 + om - ih * 60 - im) / 60).toFixed(2));
}

function makeRecord(
    id: string,
    staffId: string,
    date: string,
    status: AttendanceStatus,
    checkInTime?: string,
    checkOutTime?: string,
): AttendanceRecord {
    const staff = mockStaff.find(s => s.id === staffId);
    const shiftStart = STAFF_SHIFT_START[staffId] ?? '09:00';
    let isLate = false;
    let lateByMinutes = 0;
    if (checkInTime && (status === 'present' || status === 'late')) {
        const lateInfo = calcLate(checkInTime, shiftStart);
        isLate = lateInfo.isLate;
        lateByMinutes = lateInfo.lateByMinutes;
    }
    const workingHours = checkInTime && checkOutTime
        ? calcHours(checkInTime, checkOutTime)
        : undefined;

    return {
        id,
        staffId,
        staff,
        date,
        status: isLate ? 'late' : status,
        isLate,
        lateByMinutes: lateByMinutes > 0 ? lateByMinutes : undefined,
        checkInTime,
        checkOutTime,
        workingHours,
        outletId: 'outlet-001',
    };
}

// ── March 2026 records ────────────────────────────────────────────────────────
// Grid: rows = dates, cols = staff-001..005
// Sundays (1, 8) = weekly_off for all
//
// Day | Rajesh | Priya | Rahul | Sunita | Amit
// ----|--------|-------|-------|--------|-----
// 1 Sun  | off     | off     | off       | off      | off
// 2 Mon  | present | present | present   | present  | present
// 3 Tue  | late    | present | absent    | late     | absent
// 4 Wed  | present | absent  | present   | present  | present
// 5 Thu  | late    | late    | late      | absent   | late
// 6 Fri  | present | present | absent    | present  | present
// 7 Sat  | absent  | present | late      | late     | present
// 8 Sun  | off     | off     | off       | off      | off
// 9 Mon  | present | present | present   | present  | absent
// 10 Tue | late    | absent  | late      | present  | late
// 11 Wed | present | half_day| present   | late     | present
// 12 Thu | present | late    | present   | absent   | late
// 13 Fri | absent  | late    | late      | late     | present
// 14 Sat | present | present(+out) | late | present(+out) | present

export const mockAttendanceRecords: AttendanceRecord[] = [
    // ── March 1 (Sunday) – weekly_off ──
    makeRecord('att-0101', 'staff-001', '2026-03-01', 'weekly_off'),
    makeRecord('att-0102', 'staff-002', '2026-03-01', 'weekly_off'),
    makeRecord('att-0103', 'staff-003', '2026-03-01', 'weekly_off'),
    makeRecord('att-0104', 'staff-004', '2026-03-01', 'weekly_off'),
    makeRecord('att-0105', 'staff-005', '2026-03-01', 'weekly_off'),

    // ── March 2 (Monday) ──
    makeRecord('att-0201', 'staff-001', '2026-03-02', 'present', '08:52', '18:05'),
    makeRecord('att-0202', 'staff-002', '2026-03-02', 'present', '08:58', '18:02'),
    makeRecord('att-0203', 'staff-003', '2026-03-02', 'present', '09:55', '19:10'),
    makeRecord('att-0204', 'staff-004', '2026-03-02', 'present', '08:50', '18:00'),
    makeRecord('att-0205', 'staff-005', '2026-03-02', 'present', '12:58', '22:05'),

    // ── March 3 (Tuesday) ──
    makeRecord('att-0301', 'staff-001', '2026-03-03', 'present', '09:18', '18:10'),   // late
    makeRecord('att-0302', 'staff-002', '2026-03-03', 'present', '09:05', '18:00'),
    makeRecord('att-0303', 'staff-003', '2026-03-03', 'absent'),
    makeRecord('att-0304', 'staff-004', '2026-03-03', 'present', '09:12', '18:08'),   // late
    makeRecord('att-0305', 'staff-005', '2026-03-03', 'absent'),

    // ── March 4 (Wednesday) ──
    makeRecord('att-0401', 'staff-001', '2026-03-04', 'present', '08:48', '18:00'),
    makeRecord('att-0402', 'staff-002', '2026-03-04', 'absent'),
    makeRecord('att-0403', 'staff-003', '2026-03-04', 'present', '09:58', '19:05'),
    makeRecord('att-0404', 'staff-004', '2026-03-04', 'present', '08:55', '17:58'),
    makeRecord('att-0405', 'staff-005', '2026-03-04', 'present', '13:02', '21:58'),

    // ── March 5 (Thursday) ──
    makeRecord('att-0501', 'staff-001', '2026-03-05', 'present', '09:25', '18:15'),   // late
    makeRecord('att-0502', 'staff-002', '2026-03-05', 'present', '09:22', '18:10'),   // late
    makeRecord('att-0503', 'staff-003', '2026-03-05', 'present', '10:20', '19:15'),   // late
    makeRecord('att-0504', 'staff-004', '2026-03-05', 'absent'),
    makeRecord('att-0505', 'staff-005', '2026-03-05', 'present', '13:15', '22:00'),   // late

    // ── March 6 (Friday) ──
    makeRecord('att-0601', 'staff-001', '2026-03-06', 'present', '08:55', '18:00'),
    makeRecord('att-0602', 'staff-002', '2026-03-06', 'present', '09:00', '18:05'),
    makeRecord('att-0603', 'staff-003', '2026-03-06', 'absent'),
    makeRecord('att-0604', 'staff-004', '2026-03-06', 'present', '08:52', '18:00'),
    makeRecord('att-0605', 'staff-005', '2026-03-06', 'present', '13:00', '22:02'),

    // ── March 7 (Saturday) ──
    makeRecord('att-0701', 'staff-001', '2026-03-07', 'absent'),
    makeRecord('att-0702', 'staff-002', '2026-03-07', 'present', '09:08', '18:00'),
    makeRecord('att-0703', 'staff-003', '2026-03-07', 'present', '10:18', '19:10'),   // late
    makeRecord('att-0704', 'staff-004', '2026-03-07', 'present', '09:18', '18:05'),   // late
    makeRecord('att-0705', 'staff-005', '2026-03-07', 'present', '13:05', '22:00'),

    // ── March 8 (Sunday) – weekly_off ──
    makeRecord('att-0801', 'staff-001', '2026-03-08', 'weekly_off'),
    makeRecord('att-0802', 'staff-002', '2026-03-08', 'weekly_off'),
    makeRecord('att-0803', 'staff-003', '2026-03-08', 'weekly_off'),
    makeRecord('att-0804', 'staff-004', '2026-03-08', 'weekly_off'),
    makeRecord('att-0805', 'staff-005', '2026-03-08', 'weekly_off'),

    // ── March 9 (Monday) ──
    makeRecord('att-0901', 'staff-001', '2026-03-09', 'present', '08:58', '18:00'),
    makeRecord('att-0902', 'staff-002', '2026-03-09', 'present', '09:03', '18:05'),
    makeRecord('att-0903', 'staff-003', '2026-03-09', 'present', '09:55', '19:00'),
    makeRecord('att-0904', 'staff-004', '2026-03-09', 'present', '08:50', '17:55'),
    makeRecord('att-0905', 'staff-005', '2026-03-09', 'absent'),

    // ── March 10 (Tuesday) ──
    makeRecord('att-1001', 'staff-001', '2026-03-10', 'present', '09:20', '18:12'),   // late
    makeRecord('att-1002', 'staff-002', '2026-03-10', 'absent'),
    makeRecord('att-1003', 'staff-003', '2026-03-10', 'present', '10:25', '19:20'),   // late
    makeRecord('att-1004', 'staff-004', '2026-03-10', 'present', '08:55', '18:00'),
    makeRecord('att-1005', 'staff-005', '2026-03-10', 'present', '13:20', '22:05'),   // late

    // ── March 11 (Wednesday) ──
    makeRecord('att-1101', 'staff-001', '2026-03-11', 'present', '09:00', '18:02'),
    makeRecord('att-1102', 'staff-002', '2026-03-11', 'half_day', '09:05', '13:10'),
    makeRecord('att-1103', 'staff-003', '2026-03-11', 'present', '10:00', '19:00'),
    makeRecord('att-1104', 'staff-004', '2026-03-11', 'present', '09:20', '18:08'),   // late
    makeRecord('att-1105', 'staff-005', '2026-03-11', 'present', '13:05', '22:00'),

    // ── March 12 (Thursday) ──
    makeRecord('att-1201', 'staff-001', '2026-03-12', 'present', '08:52', '18:00'),
    makeRecord('att-1202', 'staff-002', '2026-03-12', 'present', '09:22', '18:15'),   // late
    makeRecord('att-1203', 'staff-003', '2026-03-12', 'present', '10:05', '19:10'),
    makeRecord('att-1204', 'staff-004', '2026-03-12', 'absent'),
    makeRecord('att-1205', 'staff-005', '2026-03-12', 'present', '13:18', '22:08'),   // late

    // ── March 13 (Friday) ──
    makeRecord('att-1301', 'staff-001', '2026-03-13', 'absent'),
    makeRecord('att-1302', 'staff-002', '2026-03-13', 'present', '09:18', '18:05'),   // late
    makeRecord('att-1303', 'staff-003', '2026-03-13', 'present', '10:22', '19:15'),   // late
    makeRecord('att-1304', 'staff-004', '2026-03-13', 'present', '09:15', '18:02'),   // late
    makeRecord('att-1305', 'staff-005', '2026-03-13', 'present', '13:02', '22:00'),

    // ── March 14 (Saturday) — TODAY ──
    makeRecord('att-1401', 'staff-001', '2026-03-14', 'present', '08:55'),             // no checkout
    makeRecord('att-1402', 'staff-002', '2026-03-14', 'present', '09:05', '18:10'),
    makeRecord('att-1403', 'staff-003', '2026-03-14', 'present', '10:15'),             // late, no checkout
    makeRecord('att-1404', 'staff-004', '2026-03-14', 'present', '08:58', '18:05'),
    makeRecord('att-1405', 'staff-005', '2026-03-14', 'present', '13:10'),             // no checkout
];

// ── Monthly Summaries ────────────────────────────────────────────────────────

function buildSummary(staffId: string, staffName: string): AttendanceSummary {
    const records = mockAttendanceRecords.filter(
        r => r.staffId === staffId && r.date.startsWith('2026-03')
    );
    const workingRecords = records.filter(
        r => r.status !== 'weekly_off' && r.status !== 'holiday'
    );
    const presentDays = workingRecords.filter(
        r => r.status === 'present' || r.status === 'late' || r.status === 'half_day'
    ).length;
    const absentDays = workingRecords.filter(r => r.status === 'absent').length;
    const lateDays = workingRecords.filter(r => r.isLate).length;
    const halfDays = workingRecords.filter(r => r.status === 'half_day').length;
    const totalWorkingDays = workingRecords.length;
    const totalHoursWorked = parseFloat(
        workingRecords
            .reduce((s, r) => s + (r.workingHours ?? 0), 0)
            .toFixed(1)
    );
    const checkedInRecords = workingRecords.filter(r => !!r.checkInTime);
    const avgMins = checkedInRecords.length > 0
        ? Math.round(
            checkedInRecords.reduce((s, r) => {
                const [h, m] = r.checkInTime!.split(':').map(Number);
                return s + h * 60 + m;
            }, 0) / checkedInRecords.length
        )
        : 0;
    const avgHH = String(Math.floor(avgMins / 60)).padStart(2, '0');
    const avgMM = String(avgMins % 60).padStart(2, '0');
    const attendancePct = totalWorkingDays > 0
        ? Math.round((presentDays / totalWorkingDays) * 100)
        : 0;

    return {
        staffId,
        staffName,
        month: 3,
        year: 2026,
        totalWorkingDays,
        presentDays,
        absentDays,
        lateDays,
        halfDays,
        totalHoursWorked,
        avgCheckInTime: `${avgHH}:${avgMM}`,
        attendancePct,
    };
}

export const mockAttendanceSummaries: AttendanceSummary[] = [
    buildSummary('staff-001', 'Rajesh Patil'),
    buildSummary('staff-002', 'Priya Sharma'),
    buildSummary('staff-003', 'Rahul Kumar'),
    buildSummary('staff-004', 'Sunita Devi'),
    buildSummary('staff-005', 'Amit Singh'),
];

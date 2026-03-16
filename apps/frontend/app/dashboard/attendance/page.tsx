'use client';

import { useState } from 'react';
import { Download, ClipboardEdit, MonitorSmartphone, Settings } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGate } from '@/components/shared/PermissionGate';
import { AttendanceTodaySummary } from '@/components/attendance/AttendanceTodaySummary';
import { TodayAttendanceTab } from '@/components/attendance/TodayAttendanceTab';
import { MonthlyAttendanceTab } from '@/components/attendance/MonthlyAttendanceTab';
import { AttendanceSummaryTab } from '@/components/attendance/AttendanceSummaryTab';
import { ManualAttendanceModal } from '@/components/attendance/ManualAttendanceModal';
import { KioskMode } from '@/components/attendance/KioskMode';

export default function AttendancePage() {
    const now = new Date();
    const { enableAttendance } = useSettingsStore();
    const [activeTab, setActiveTab] = useState('today');
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
    const [showManualModal, setShowManualModal] = useState(false);
    const [showKioskMode, setShowKioskMode] = useState(false);

    function handleExport() {
        // Placeholder — export CSV logic can be wired later
        console.log('Export attendance data');
    }

    // If attendance tracking is disabled via settings
    if (enableAttendance === false) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track check-ins, working hours, and monthly summaries
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border">
                    <Settings className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        Attendance tracking is disabled
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Enable attendance tracking in Settings to start recording check-ins and working hours.
                    </p>
                    <Link href="/dashboard/settings">
                        <Button variant="outline">
                            Go to Settings
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track check-ins, working hours, and monthly summaries
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <PermissionGate permission="manage_staff">
                        <Button variant="outline" onClick={() => setShowManualModal(true)}>
                            <ClipboardEdit className="w-4 h-4 mr-2" />
                            Mark Attendance
                        </Button>
                    </PermissionGate>
                    <Button onClick={() => setShowKioskMode(true)}>
                        <MonitorSmartphone className="w-4 h-4 mr-2" />
                        Kiosk Mode
                    </Button>
                </div>
            </div>

            {/* Today summary strip */}
            <AttendanceTodaySummary />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly View</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="today" className="mt-4">
                    <TodayAttendanceTab onMarkManual={() => setShowManualModal(true)} />
                </TabsContent>

                <TabsContent value="monthly" className="mt-4">
                    <MonthlyAttendanceTab
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        selectedStaffId={selectedStaffId}
                        onMonthChange={setSelectedMonth}
                        onYearChange={setSelectedYear}
                        onStaffChange={setSelectedStaffId}
                    />
                </TabsContent>

                <TabsContent value="summary" className="mt-4">
                    <AttendanceSummaryTab
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={setSelectedMonth}
                        onYearChange={setSelectedYear}
                    />
                </TabsContent>
            </Tabs>

            {/* Manual attendance modal */}
            <ManualAttendanceModal
                isOpen={showManualModal}
                onClose={() => setShowManualModal(false)}
            />

            {/* Kiosk mode — fullscreen portal */}
            {showKioskMode && (
                <KioskMode onExit={() => setShowKioskMode(false)} />
            )}
        </div>
    );
}

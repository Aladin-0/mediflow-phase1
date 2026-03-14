import { Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function MarkAttendancePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh]">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">10:45 AM</h1>
                <p className="text-xl text-slate-500">Kiosk mode — Stage 10</p>
            </div>

            <Card className="border-dashed border-2 border-slate-200 w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                        Coming in next stage
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                        Staff check-in check-out interface coming soon
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

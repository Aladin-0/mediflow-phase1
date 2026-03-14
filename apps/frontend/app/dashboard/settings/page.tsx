import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Pharmacy profile, printer setup, and preferences
                    </p>
                </div>
            </div>

            <Card className="border-dashed border-2 border-slate-200">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Settings className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                        Coming in next stage
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                        Application settings coming soon
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

import { UserCog, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PermissionGate } from '@/components/shared/PermissionGate';

export default function StaffPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Manage staff, PINs, roles, and performance tracking
                    </p>
                </div>
                <PermissionGate permission="manage_staff">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Staff Member
                    </Button>
                </PermissionGate>
            </div>

            <Card className="border-dashed border-2 border-slate-200">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <UserCog className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                        Coming in next stage
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                        Staff controls coming soon
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

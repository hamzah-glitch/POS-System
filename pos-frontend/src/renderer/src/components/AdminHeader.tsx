import { User } from 'lucide-react';

interface AdminHeaderProps { }

export default function AdminHeader({ }: AdminHeaderProps) {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 fixed top-0 right-0 left-64 z-20">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-gray-800">Store Admin</div>
                        <div className="text-xs text-gray-500">admin@pos.com</div>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <User className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
}

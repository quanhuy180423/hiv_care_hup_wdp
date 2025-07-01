import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRoles } from '@/hooks/useRoles';
import { PlusIcon, Search } from 'lucide-react';
import { useRoleDrawerStore, useRoleModalStore } from '@/store/roleStore';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import RoleFormModal from './components/RoleFormModal';
import RoleDetailsDrawer from './components/RoleDetailsDrawer';

const RoleManagement = () => {
  const [searchText, setSearchText] = useState('');
  const { data: roles, isLoading } = useRoles(searchText);
  const { isOpen: isModalOpen, openModal, closeModal } = useRoleModalStore();
  const { isOpen: isDrawerOpen, closeDrawer } = useRoleDrawerStore();

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút tạo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý vai trò</h1>
        <Button onClick={() => openModal()} className="cursor-pointer" variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo vai trò
        </Button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm vai trò..."
          className="pl-10"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Danh sách vai trò</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={(roles || []).filter((role) => role.deletedAt === null)}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Modal và Drawer */}
      <RoleFormModal open={isModalOpen} onClose={closeModal} />
      <RoleDetailsDrawer open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default RoleManagement;

import { useState, useEffect } from 'react';
import { Icon, IconName } from '@/lib/components/IconSVG';
import { useEditGroup } from '../hooks/useEditGroupName';
import { useDeleteGroup } from '../hooks/useDeleteGroup';
import { useChecklists } from '@/app/inputs/context/ChecklistsContext';
import { Modal } from '@/lib/components/modal';
import { useRouter } from 'next/navigation';

interface GroupHeaderProps {
  groupName: string;
}

const GroupHeader = ({ groupName: initialGroupName }: GroupHeaderProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(initialGroupName);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { checklists } = useChecklists();

  const editGroupMutation = useEditGroup();
  const deleteGroupMutation = useDeleteGroup();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    deleteGroupMutation.mutate({ groupName, checklists });
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    editGroupMutation.mutate({
      groupName: initialGroupName,
      newGroupName: groupName,
      checklists,
    });
  };

  const handleCancel = () => {
    setGroupName(initialGroupName);
    setIsEditing(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (editGroupMutation.isSuccess && isSaving) {
      setModalMessage('Group Name Changed successfully');
      setIsSaving(false);
      setIsEditing(false);
      setIsModalVisible(true);
    } else if (editGroupMutation.isError && isSaving) {
      setModalMessage('Failed to update group name. Please try again.');
      setIsSaving(false);
      setIsEditing(false);
      setIsModalVisible(true);
    }
  }, [editGroupMutation.isSuccess, editGroupMutation.isError, isSaving]);

  useEffect(() => {
    if (deleteGroupMutation.isSuccess) {
      setModalMessage('Group deleted successfully.');
      setIsModalVisible(true);

      setTimeout(() => {
        router.push('/inputs/checklists');
      }, 1000); // Delay to show the success message
    } else if (deleteGroupMutation.isError) {
      setModalMessage('Failed to delete the group. Please try again.');
      setIsModalVisible(true);
    }
  }, [deleteGroupMutation.isSuccess, deleteGroupMutation.isError, router]);

  return (
    <div className="ml-6 mr-6 mt-6 flex justify-between">
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="bg-secondary-900 px-2 text-3xl font-bold"
            autoFocus
            maxLength={128}
          />
          <button
            type="submit"
            className="text-white hover:text-primary-500"
            disabled={editGroupMutation.isPending || isSaving}>
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="text-white hover:text-primary-500">
            Cancel
          </button>
        </form>
      ) : (
        <h1 className="text-3xl font-bold">{groupName}</h1>
      )}

      <div className="flex justify-between gap-2">
        <button
          onClick={handleEditClick}
          disabled={isEditing || editGroupMutation.isPending}
          className="hover:text-primary-500">
          <Icon
            name={IconName.Pencil}
            color="#FFFFFF"
          />
        </button>
        <button
          onClick={handleDeleteClick}
          disabled={deleteGroupMutation.isPending}
          className="hover:text-primary-500">
          <Icon
            name={IconName.Delete}
            color="#FFFFFF"
          />
        </button>
      </div>

      {isModalVisible && (
        <Modal
          heading={modalMessage.includes('successfully') ? 'Success' : 'Error'}
          enableScreenOverlay={true}
          onCloseIconClick={handleModalClose}>
          <p>{modalMessage}</p>
        </Modal>
      )}

      {isDeleteModalVisible && (
        <Modal
          heading="Confirm Deletion"
          enableScreenOverlay={true}
          onCloseIconClick={handleDeleteCancel}
          primaryBtnLabel="Confirm"
          secondaryBtnLabel="Cancel"
          onPrimaryBtnClick={handleDeleteConfirm}
          onSecondaryBtnClick={handleDeleteCancel}>
          <p>
            Are you sure you want to delete this group and all its checklists?
          </p>
        </Modal>
      )}
    </div>
  );
};

export default GroupHeader;

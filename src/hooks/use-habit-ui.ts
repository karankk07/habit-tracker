import { useState } from 'react';

export function useHabitUI() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const openEditDialog = () => setShowEditDialog(true);
  const closeEditDialog = () => setShowEditDialog(false);

  const openDeleteDialog = () => setShowDeleteDialog(true);
  const closeDeleteDialog = () => setShowDeleteDialog(false);

  return {
    loading,
    startLoading,
    stopLoading,
    showEditDialog,
    showDeleteDialog,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
  };
} 
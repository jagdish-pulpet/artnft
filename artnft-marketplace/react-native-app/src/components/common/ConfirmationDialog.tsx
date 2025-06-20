// react-native-app/src/components/common/ConfirmationDialog.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import AppButton from './Button';
import { theme } from '../../styles/theme';
import { AlertTriangle } from 'lucide-react-native';

interface ConfirmationDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isVisible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <View style={styles.header}>
            {isDestructive && <AlertTriangle size={24} color={theme.colors.destructive} style={styles.icon} />}
            <Text style={[styles.title, isDestructive && styles.titleDestructive]}>{title}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            <AppButton
              title={cancelText}
              onPress={onCancel}
              variant="outline"
              style={styles.button}
              disabled={isLoading}
            />
            <AppButton
              title={confirmText}
              onPress={onConfirm}
              variant={isDestructive ? "destructive" : "primary"}
              style={styles.button}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  dialogContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  titleDestructive: {
    color: theme.colors.destructive,
  },
  message: {
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  button: {
    minWidth: 100,
  },
});

export default ConfirmationDialog;

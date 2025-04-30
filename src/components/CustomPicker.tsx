import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors, commonColors } from '@/styles/colors';
import TextComp from './TextComp';
import { moderateScale } from '@/styles/scaling';
import useIsRTL from '@/hooks/useIsRTL';

interface CustomPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ label: string; value: string }>;
  placeholder?: string;
  style?: any;
  containerStyle?: any;
  disabled?: boolean;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  value,
  onValueChange,
  items,
  placeholder = 'SELECT_OPTION',
  style,
  containerStyle,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const isRTL = useIsRTL();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find(item => item.value === value);

  const handleSelect = (item: { label: string; value: string }) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: item.value === value ? commonColors.primary + '20' : colors.background,
          borderBottomColor: colors.inputBorder,
        },
      ]}
      onPress={() => handleSelect(item)}
    >
      <TextComp
        text={item.label}
        style={[
          styles.itemText,
          {
            color: item.value === value ? commonColors.primary : colors.text,
            textAlign: isRTL ? 'right' : 'left',
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          {
            backgroundColor: colors.background,
            borderColor: colors.inputBorder,
          },
          style,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <TextComp
          text={selectedItem?.label || placeholder}
          style={[
            styles.pickerText,
            {
              color: selectedItem ? colors.text : colors.textSecondary,
              textAlign: isRTL ? 'right' : 'left',
            },
          ]}
        />
        <View
          style={[
            styles.chevron,
            {
              transform: [{ rotate: modalVisible ? '180deg' : '0deg' }],
            },
          ]}
        >
          <TextComp
            text="▼"
            style={[
              styles.chevronText,
              { color: colors.textSecondary }
            ]}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.inputBorder,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <TextComp
                text="SELECT_OPTION"
                style={[styles.modalTitle, { color: colors.text }]}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <TextComp
                  text="CLOSE"
                  style={[styles.closeButtonText, { color: commonColors.primary }]}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: moderateScale(8),
  },
  pickerText: {
    flex: 1,
    fontSize: moderateScale(16),
  },
  chevron: {
    marginLeft: moderateScale(8),
  },
  chevronText: {
    fontSize: moderateScale(12),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  closeButton: {
    padding: moderateScale(8),
  },
  closeButtonText: {
    fontSize: moderateScale(16),
  },
  list: {
    maxHeight: moderateScale(400),
  },
  item: {
    padding: moderateScale(16),
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: moderateScale(16),
  },
});

export default CustomPicker; 
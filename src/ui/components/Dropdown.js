import React, { useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Dropdown({
  label,
  options = [],
  value,
  selectedOption,
  onChange,
  style,
  styles,
}) {
  const [open, setOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(220);
  const anchorRef = useRef(null);

  const displayValue = useMemo(() => {
    if (typeof value === 'string' && value.length > 0) return value;
    if (typeof selectedOption === 'string') return selectedOption;
    return 'Select';
  }, [value, selectedOption]);

  function pick(opt) {
    setOpen(false);
    if (onChange) onChange(opt);
  }

  function openMenu() {
    const node = anchorRef.current;
    if (node && typeof node.measureInWindow === 'function') {
      node.measureInWindow((_x, y, _w, h) => {
        if (typeof y === 'number' && typeof h === 'number') {
          setMenuTop(y + h + 8);
        }
        setOpen(true);
      });
      return;
    }
    setOpen(true);
  }

  return (
    <View style={style}>
      <TouchableOpacity
        ref={anchorRef}
        collapsable={false}
        style={[styles?.dropdownButton, styles?.chip]}
        onPress={openMenu}
      >
        <Text style={[styles?.dropdownButtonText, styles?.chipText]}>{displayValue}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles?.menuBackdrop} onPress={() => setOpen(false)}>
          <View />
        </Pressable>
        <View style={[styles?.menuContainer, { left: 16, right: 16, top: menuTop }]}>
          <Text style={styles?.modalTitle}>{label}</Text>
          <ScrollView style={{ maxHeight: 260 }}>
            {options.map((opt) => (
              <TouchableOpacity
                key={String(opt)}
                style={[styles?.dropdownItem, styles?.chip, opt === selectedOption && styles?.chipActive]}
                onPress={() => pick(opt)}
              >
                <Text style={[styles?.chipText, opt === selectedOption && styles?.chipTextActive]}>
                  {String(opt)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

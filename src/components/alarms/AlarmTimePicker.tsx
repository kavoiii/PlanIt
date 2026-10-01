import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { DateTimePicker as CommunityDateTimePicker } from '@expo/ui/community/datetime-picker';
import { DatePicker, Host } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

type AlarmTimePickerProps = {
  value: Date;
  onChange: (value: Date) => void;
};

export function AlarmTimePicker({ value, onChange }: AlarmTimePickerProps) {
  if (Platform.OS === 'ios') {
    return (
      <Host style={styles.timePickerHost}>
        <DatePicker
          title=""
          selection={value}
          displayedComponents={['hourAndMinute']}
          onDateChange={onChange}
          modifiers={[datePickerStyle('wheel')]}
        />
      </Host>
    );
  }

  return <AndroidAlarmTimePicker value={value} onChange={onChange} />;
}

function AndroidAlarmTimePicker({ value, onChange }: AlarmTimePickerProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.timePickerHost}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose alarm time, ${value.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })}`}
        onPress={() => setVisible(true)}
        style={styles.androidTimeButton}
      >
        <Text style={styles.androidTimeText}>
          {value.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </Text>
      </Pressable>
      {visible && (
        <CommunityDateTimePicker
          value={value}
          mode="time"
          presentation="dialog"
          onValueChange={(_event, selectedTime) => {
            setVisible(false);
            onChange(selectedTime);
          }}
          onDismiss={() => setVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timePickerHost: {
    width: '100%',
    height: spacing.xxxl * 3,
  },
  androidTimeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidTimeText: {
    ...typography.display,
    color: colors.text,
  },
});

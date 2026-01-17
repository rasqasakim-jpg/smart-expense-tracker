import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

interface ValidatedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  error,
  touched,
  style,
  ...props
}) => {
  const showError = error && touched;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          showError && styles.inputError,
          style,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      
      {showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
});

export default ValidatedInput;
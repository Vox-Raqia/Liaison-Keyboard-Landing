import React from 'react';
import { 
  Alert, 
} from 'react-native';
import { useTheme } from '../../lib/theme';
import { ARTICLE9_CONSENT_VERSION } from '../../lib/consent/article9ConsentService';
import { grantArticle9Consent } from '../../lib/consent/article9ConsentService';

interface Article9ConsentDialogProps {
  visible: boolean;
  onConsentGranted: () => void;
  onConsentDenied: () => void;
}

export function Article9ConsentDialog({ visible, onConsentGranted, onConsentDenied }: Article9ConsentDialogProps) {
  const theme = useTheme();
  
  const handleAccept = async () => {
    // Grant consent via service
    const success = await grantArticle9Consent();
    if (success) {
      onConsentGranted();
    } else {
      // Show error
      Alert.alert('Error', 'Could not save consent. Please try again.');
    }
  };
  
  const handleDecline = () => {
    onConsentDenied();
  };

  if (!visible) return null;

  Alert.alert(
    'Special Category Data Consent (GDPR Article 9)',
    'Liaison Reply processes message content that may reveal special category personal data (e.g., health, political beliefs, religious views, sexual orientation). We need your explicit consent to process this data for AI reply generation. You can revoke consent at any time in Settings → Privacy.',
    [
      {
        text: 'Decline',
        onPress: handleDecline,
        style: 'cancel'
      },
      {
        text: 'I Consent',
        onPress: handleAccept,
        style: 'default'
      }
    ]
  );
  
  return null;
}
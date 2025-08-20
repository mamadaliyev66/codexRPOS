import React from 'react';
import { View, Text, ScrollView } from 'react-native';

type State = { hasError: boolean; info?: string; error?: string };
export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: String(error) };
  }
  componentDidCatch(error: any, info: any) {
    this.setState({ info: info?.componentStack });
    if (typeof window !== 'undefined') console.error('App error:', error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, padding: 24, gap: 12, justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>
            Xatolik yuz berdi — ilova ishga tushmadi
          </Text>
          <Text>Ilovani qayta yuklab ko‘ring. Dasturchilar uchun ma’lumot:</Text>
          {this.state.error ? (
            <Text selectable style={{ fontFamily: 'monospace' }}>{this.state.error}</Text>
          ) : null}
          {this.state.info ? (
            <Text selectable style={{ fontFamily: 'monospace' }}>{this.state.info}</Text>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

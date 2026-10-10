import Tabs from 'expo-router/js-tabs';
import { useSegments } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { Atmosphere } from '@/components/atmosphere/atmosphere';
import { OnlinePresenceSync } from '@/components/online-presence-sync';
import { useAtmosphereMood } from '@/components/atmosphere/config';
import { DesktopSidebar } from '@/components/desktop-sidebar';
import { FloatingTabBar } from '@/components/floating-tab-bar';
import { HomeGreetingWallpaper } from '@/components/social/home-greeting-wallpaper';
import { NAV_ITEMS } from '@/components/nav-items';
import { PageTitle } from '@/components/page-title';
import { Signature } from '@/components/signature';
import { webStyle } from '@/components/ui/web';
import { cssTransition, MOTION } from '@/constants/motion';
import { DESKTOP_BREAKPOINT, SIDEBAR_WIDTH } from '@/constants/theme';
import { useTabBarMode } from '@/data/navigation-settings';

/**
 * Web navigation shell.
 *
 *   atmosphere (page light) → rail or floating bar → screens → signature
 *
 * Desktop: the five destinations live in a left rail (docked, or floating
 * with auto-hide). Narrow windows: the floating bottom bar, like the phone
 * app. Destinations, order and hidden routes are identical to the native
 * shell, so the five-tab identity is preserved on every platform.
 */
export default function AppTabs() {
  const segments = useSegments();
  const { width } = useWindowDimensions();
  const mode = useTabBarMode();
  const mood = useAtmosphereMood();
  const reduceMotion = useReducedMotion();

  // Unauthenticated screens must not show the authenticated navigation.
  const isAuthRoute = ['login', 'onboarding', 'privacy', 'terms'].includes(segments[0] as string);
  const isWidgetRoute = segments[0] === 'widget';
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const useRail = !isAuthRoute && !isWidgetRoute && isDesktop;
  const docked = useRail && mode === 'alwaysVisible';

  return (
    <View style={styles.shell}>
      <OnlinePresenceSync />
      {/* Keeps the document title correct on every route. */}
      <PageTitle />
      <Atmosphere mood={mood} />
      {(segments[0] as string | undefined) === 'index' ? <HomeGreetingWallpaper /> : null}

      {useRail ? <DesktopSidebar docked={docked} /> : null}

      <View style={[styles.content, { paddingLeft: docked ? SIDEBAR_WIDTH : 0 }]}>
        <Tabs
          backBehavior="history"
          tabBar={({ navigation }) =>
            useRail || isAuthRoute || isWidgetRoute ? null : <FloatingTabBar onNavigate={(route) => navigation.navigate(route as never)} />
          }
          screenOptions={{
            headerShown: false,
            // Screens are transparent so the atmosphere shows through.
            sceneStyle: styles.scene,
            // Screens are transparent, so inactive ones must fade out rather
            // than rely on an opaque background to cover them. Also gives tab
            // switches a short cross-fade (instant under reduced motion).
            animation: 'fade',
            transitionSpec: { animation: 'timing', config: { duration: reduceMotion ? 0 : MOTION.standard - 40 } },
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Tabs.Screen key={item.route} name={item.route} options={{ title: item.label, tabBarAccessibilityLabel: item.accessibilityLabel }} />
          ))}

          {/* Hidden routes used for navigation */}
          <Tabs.Screen name="progress" options={{ href: null }} />
          <Tabs.Screen name="settings" options={{ href: null }} />
          <Tabs.Screen name="login" options={{ href: null }} />
          <Tabs.Screen name="onboarding" options={{ href: null }} />
          <Tabs.Screen name="choose-username" options={{ href: null }} />
          <Tabs.Screen name="privacy" options={{ href: null }} />
          <Tabs.Screen name="terms" options={{ href: null }} />
          <Tabs.Screen name="widget" options={{ href: null }} />
          <Tabs.Screen name="social/friends" options={{ href: null }} />
          <Tabs.Screen name="explore/discovery" options={{ href: null }} />
          <Tabs.Screen name="learn/anatomy" options={{ href: null }} />
          <Tabs.Screen name="learn/biochemistry" options={{ href: null }} />
          <Tabs.Screen name="learn/physiology" options={{ href: null }} />
          <Tabs.Screen name="learn/course" options={{ href: null }} />
          <Tabs.Screen name="learn/fatty-acid-biosynthesis" options={{ href: null }} />
          <Tabs.Screen name="learn/lesson" options={{ href: null }} />
          <Tabs.Screen name="learn/quiz" options={{ href: null }} />
          <Tabs.Screen name="learn/results" options={{ href: null }} />
          <Tabs.Screen name="learn/topic" options={{ href: null }} />
          <Tabs.Screen name="learn/review" options={{ href: null }} />
          <Tabs.Screen name="learn/apex" options={{ href: null }} />
          <Tabs.Screen name="learn/flashcards" options={{ href: null }} />
          <Tabs.Screen name="learn/tutor" options={{ href: null }} />
        </Tabs>
      </View>

      {!isWidgetRoute ? <Signature aboveTabBar={!useRail && !isAuthRoute} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, overflow: 'hidden' },
  content: { flex: 1, zIndex: 1, ...webStyle(cssTransition('padding-left', MOTION.standard)) },
  scene: { backgroundColor: 'transparent' },
});

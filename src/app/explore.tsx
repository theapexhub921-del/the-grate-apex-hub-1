import { type Href, router } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Icon, type IconName } from '@/components/ui/icon';
import { Card, PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { PageHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { EmptyState } from '@/components/ui/state-views';
import { webStyle } from '@/components/ui/web';
import { elevation, isDesktopWidth, isWideWidth, Radius, Type, type ThemeColors } from '@/constants/theme';
import { contentTopics } from '@/data/content-catalog';
import { type ExploreItem, getCategoryLabel, getFeaturedItem, getItemsByCategory, isNewItem } from '@/data/explore';
import { POWERUP_MULTIPLIERS, XP_RULES } from '@/data/learning/xp-rules';
import { useProgress } from '@/data/progress';
import { getRankProgress, LEAGUE_RULES, RANKS } from '@/data/ranks';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// Explore = optional discovery. Nothing here is graded or tracked.
function openItem(item: ExploreItem) {
  router.push(`/explore/discovery?id=${item.id}` as Href);
}

const CATEGORY_ICON: Record<ExploreItem['category'], IconName> = {
  concept: 'connection',
  research: 'research',
  grateapex: 'sparkle',
};

// A discovery card. Draft (unreviewed) content always says so.
function ItemCard({ item, size = 'md', fill = false }: { item: ExploreItem; size?: 'md' | 'sm'; fill?: boolean }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <PressableCard onPress={() => openItem(item)} accessibilityLabel={`${item.title}. ${item.summary}`} style={[styles.itemCard, size === 'sm' && styles.itemCardSmall, fill && styles.itemCardFill]}>
      {({ hovered }) => (
        <>
          <View style={styles.itemTop}>
            <View style={styles.itemIcon}>
              <Icon name={CATEGORY_ICON[item.category]} size={16} color={colors.primaryText} />
            </View>
            <Text style={styles.itemTopic}>{item.topic.toUpperCase()}</Text>
            {isNewItem(item) ? <Pill label="New" tone="gold" /> : null}
            {item.provenance.status === 'draft' ? <Pill label="Draft" /> : null}
          </View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSummary} numberOfLines={3}>
            {item.summary}
          </Text>
          <View style={styles.itemFooter}>
            <Text style={[styles.itemLink, hovered && styles.itemLinkHover]}>Read</Text>
            <Icon name="arrowRight" size={14} color={hovered ? colors.text : colors.primaryText} />
          </View>
        </>
      )}
    </PressableCard>
  );
}

export default function ExploreScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const desktop = isDesktopWidth(width);
  const wide = isWideWidth(width);

  const featured = getFeaturedItem();
  const concepts = getItemsByCategory('concept');
  const research = getItemsByCategory('research');
  const features = getItemsByCategory('grateapex');
  // Two newest features sit beside the featured story; the rest join the
  // "Inside GRATEAPEX" grid (still marked New).
  const newest = features.filter((item) => isNewItem(item)).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const newFeatures = newest.slice(0, 2);
  const otherFeatures = [...newest.slice(2), ...features.filter((item) => !isNewItem(item))];
  const published = contentTopics.filter((topic) => topic.status === 'published');
  const inPreparation = contentTopics.filter((topic) => topic.status === 'source-only');

  return (
    <Screen width="wide">
      <PageHeader eyebrow="Discovery" title="Explore" subtitle="Medicine beyond the syllabus — and what’s new in GRATEAPEX." />

      {/* Featured story + What's new: an editorial bento. */}
      <View style={[styles.bento, desktop && styles.bentoDesktop]}>
        {featured ? (
          <PressableCard
            onPress={() => openItem(featured)}
            accessibilityLabel={`Featured: ${featured.title}. ${featured.summary}`}
            style={[styles.featured, desktop && styles.featuredDesktop, elevation(colors, 2)]}
          >
            <FeaturedArt pulse={desktop} />
            <View style={styles.featuredKickerRow}>
              <Text style={styles.featuredKicker}>FEATURED · {featured.topic.toUpperCase()}</Text>
              {featured.provenance.status === 'draft' ? <Pill label="Draft for review" /> : null}
            </View>
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.featuredSummary}>{featured.summary}</Text>
            <View style={styles.featuredCta}>
              <Text style={styles.featuredCtaText}>Discover</Text>
              <Icon name="arrowRight" size={16} color="#0A1F5C" />
            </View>
          </PressableCard>
        ) : null}

        <View style={[styles.newsColumn, desktop && styles.newsColumnDesktop]}>
          <Card style={styles.newsCard}>
            <View style={styles.newsHeader}>
              <Icon name="announcement" size={18} color={colors.accentText} />
              <Text style={styles.newsTitle}>What’s new</Text>
            </View>
            <View style={styles.newsRow}>
              <Text style={styles.newsNumber}>{published.length}</Text>
              <Text style={styles.newsText}>Biochemistry topics are live, each with lessons, quizzes and spaced review built from your lectures.</Text>
            </View>
            {inPreparation.length > 0 ? (
              <View style={styles.newsRow}>
                <Text style={[styles.newsNumber, styles.newsNumberMuted]}>{inPreparation.length}</Text>
                <Text style={styles.newsText}>more lecture topics received — lessons in preparation.</Text>
              </View>
            ) : null}
          </Card>
          {newFeatures.map((item) => (
            <ItemCard key={item.id} item={item} size="sm" />
          ))}
        </View>
      </View>

      <SectionHeader title={getCategoryLabel('concept')} subtitle="Clinical connections: ideas that explain what you will see in patients." style={styles.section} />
      <View style={styles.grid}>
        {concepts.map((item) => (
          <View key={item.id} style={[styles.gridItem, desktop && (wide ? styles.gridItemThird : styles.gridItemHalf)]}>
            <ItemCard item={item} fill />
          </View>
        ))}
      </View>

      <SectionHeader title={getCategoryLabel('research')} subtitle="Carefully selected research and emerging science." style={styles.section} />
      {research.length > 0 ? (
        <View style={styles.grid}>
          {research.map((item) => (
            <View key={item.id} style={[styles.gridItem, desktop && styles.gridItemHalf]}>
              <ItemCard item={item} fill />
            </View>
          ))}
        </View>
      ) : (
        <EmptyState icon="research" title="Coming soon" message="Research summaries will appear here once they have been reviewed — nothing unverified is published." />
      )}

      {otherFeatures.length > 0 ? (
        <>
          <SectionHeader title="Inside GRATEAPEX" subtitle="Features you can use today." style={styles.section} />
          <View style={styles.grid}>
            {otherFeatures.map((item) => (
              <View key={item.id} style={[styles.gridItem, desktop && (wide ? styles.gridItemThird : styles.gridItemHalf)]}>
                <ItemCard item={item} size="sm" fill />
              </View>
            ))}
          </View>
        </>
      ) : null}

      <Journey />
    </Screen>
  );
}

// Decorative art for the featured story: concentric rings and a pulse
// line — abstract, not a stock photo.
function FeaturedArt({ pulse }: { pulse: boolean }) {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="xMaxYMid slice" viewBox="0 0 600 320">
      <Circle cx={520} cy={60} r={90} stroke="#FFFFFF" strokeOpacity={0.08} fill="none" />
      <Circle cx={520} cy={60} r={150} stroke="#FFFFFF" strokeOpacity={0.06} fill="none" />
      <Circle cx={520} cy={60} r={215} stroke="#FFFFFF" strokeOpacity={0.045} fill="none" />
      {pulse ? <Path d="M300 92 H390 L405 67 L425 124 L447 40 L466 108 L478 92 H600" stroke="#FDC00A" strokeOpacity={0.55} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
    </Svg>
  );
}

// "The GRATEAPEX Journey" — the one place the full rank ladder is revealed.
// Everyday screens only ever show the current rank and the gap to the next.
function Journey() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const desktop = isDesktopWidth(width);
  const progress = useProgress();
  const current = getRankProgress(progress.xp);
  const ready = RANKS.every((rank) => rank.minXp !== null);
  if (!ready) return null;

  const ladder = (
    <Card style={styles.ladderCard}>
      {RANKS.map((rank, index) => {
        const reached = progress.xp >= (rank.minXp ?? 0);
        const isCurrent = current?.rank.id === rank.id;
        const last = index === RANKS.length - 1;
        return (
          <View key={rank.id} style={styles.ladderRow}>
            <View style={styles.ladderRail}>
              <View style={[styles.ladderNode, reached && styles.ladderNodeReached, isCurrent && styles.ladderNodeCurrent]}>
                {reached ? <Icon name={isCurrent ? 'rank' : 'check'} size={isCurrent ? 14 : 12} color={isCurrent ? '#0A1F5C' : colors.onPrimary} strokeWidth={2.4} /> : null}
              </View>
              {!last ? <View style={[styles.ladderLine, reached && styles.ladderLineReached]} /> : null}
            </View>
            <View style={[styles.ladderText, !last && styles.ladderTextSpaced]}>
              <View style={styles.ladderTitleRow}>
                <Text style={[styles.ladderName, !reached && styles.ladderNameLocked]}>{rank.name}</Text>
                {isCurrent ? <Pill label="You are here" tone="gold" /> : null}
              </View>
              <Text style={styles.ladderXp}>{(rank.minXp ?? 0).toLocaleString()} XP</Text>
            </View>
          </View>
        );
      })}
    </Card>
  );

  const rules = (
    <View style={styles.rulesColumn}>
      <Card style={styles.ruleCard}>
        <View style={styles.ruleHeader}>
          <Icon name="xp" size={18} color={colors.accentText} filled />
          <Text style={styles.ruleTitle}>How XP works</Text>
        </View>
        <Text style={styles.ruleText}>
          Meaningful tasks earn {XP_RULES.taskMin}–{XP_RULES.taskMax} XP: a lesson, a quiz, a review session, an Apex run. Each reward is given once per source.
        </Text>
        <Text style={styles.ruleText}>
          Wrong answers in lesson and topic quizzes cost {XP_RULES.lessonQuiz.wrongPenalty} XP each. Review and practising wrong answers never cost XP — forgetting is expected there.
        </Text>
      </Card>
      <Card style={styles.ruleCard}>
        <View style={styles.ruleHeader}>
          <Icon name="sparkle" size={18} color={colors.accentText} />
          <Text style={styles.ruleTitle}>Power-ups</Text>
          <Pill label="Coming soon" />
        </View>
        <View style={styles.multipliers}>
          {POWERUP_MULTIPLIERS.filter((value) => value > 1).map((value) => (
            <View key={value} style={styles.multiplier}>
              <Text style={styles.multiplierText}>×{value}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.ruleText}>Power-ups multiply the XP you gain. They never reduce a penalty or change whether an answer was right.</Text>
      </Card>
      <Card style={styles.ruleCard}>
        <View style={styles.ruleHeader}>
          <Icon name="rank" size={18} color={colors.primaryText} />
          <Text style={styles.ruleTitle}>Leagues</Text>
        </View>
        <Text style={styles.ruleText}>
          Weekly, among learners at your rank. The top {Math.round(LEAGUE_RULES.promotionShare * 100)}% advance — only if they also meet the next level&apos;s XP requirement. The bottom {Math.round(LEAGUE_RULES.relegationShare * 100)}% move down; everyone else stays.
        </Text>
      </Card>
    </View>
  );

  return (
    <View style={styles.journey}>
      <SectionHeader
        title="The GRATEAPEX Journey"
        subtitle="Lifetime XP carries you from your first lecture to Consultant. Each stage takes more than the last."
        style={styles.section}
      />
      {desktop ? (
        <View style={styles.journeyRow}>
          <View style={styles.flex}>{ladder}</View>
          <View style={styles.journeySide}>{rules}</View>
        </View>
      ) : (
        <View style={styles.rulesColumn}>
          {ladder}
          {rules}
        </View>
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    section: { marginTop: 34 },

    bento: { gap: 14 },
    bentoDesktop: { flexDirection: 'row', alignItems: 'stretch' },
    featured: {
      minHeight: 300,
      justifyContent: 'flex-end',
      padding: 26,
      borderRadius: Radius.xl,
      backgroundColor: '#0A2A84',
      borderColor: 'rgba(140, 175, 255, 0.28)',
      overflow: 'hidden',
      ...webStyle({ backgroundImage: 'radial-gradient(90% 120% at 100% 0%, rgba(253,192,10,0.18), transparent 50%), linear-gradient(140deg, #1446C8 0%, #0A2A84 55%, #071C5E 100%)' }),
    },
    featuredDesktop: { flex: 1.6 },
    featuredKickerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
    featuredKicker: { ...Type.overline, color: '#FFD04A' },
    featuredTitle: { ...Type.display, fontSize: 32, lineHeight: 38, color: '#FFFFFF', maxWidth: 560 },
    featuredSummary: { fontSize: 16, lineHeight: 24, color: '#D3DEFA', marginTop: 8, maxWidth: 520 },
    featuredCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'flex-start',
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 14,
      backgroundColor: '#FDC00A',
    },
    featuredCtaText: { fontSize: 15, fontWeight: '800', color: '#0A1F5C' },
    newsColumn: { gap: 14 },
    newsColumnDesktop: { flex: 1, minWidth: 0 },
    newsCard: { gap: 12 },
    newsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    newsTitle: { ...Type.title3, color: colors.text },
    newsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    newsNumber: { ...Type.numeral, fontSize: 30, color: colors.accentText, minWidth: 34 },
    newsNumberMuted: { color: colors.textTertiary },
    newsText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.textSecondary },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    gridItem: { width: '100%' },
    gridItemHalf: { width: '48.9%', flexGrow: 1 },
    gridItemThird: { width: '31.9%', flexGrow: 1 },
    itemCard: { gap: 8 },
    itemCardFill: { flex: 1 },
    itemCardSmall: { gap: 6 },
    itemTop: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    itemIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    itemTopic: { ...Type.overline, fontSize: 10, color: colors.textTertiary, flexShrink: 1 },
    itemTitle: { ...Type.title3, color: colors.text },
    itemSummary: { fontSize: 13.5, lineHeight: 20, color: colors.textSecondary },
    itemFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 6 },
    itemLink: { fontSize: 13, fontWeight: '800', color: colors.primaryText },
    itemLinkHover: { color: colors.text },

    journey: { marginTop: 6 },
    journeyRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
    journeySide: { width: 380 },
    rulesColumn: { gap: 14 },
    ladderCard: { paddingVertical: 20 },
    ladderRow: { flexDirection: 'row', gap: 14 },
    ladderRail: { alignItems: 'center', width: 28 },
    ladderNode: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surfaceSunken,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ladderNodeReached: { backgroundColor: colors.primary, borderColor: colors.primary },
    ladderNodeCurrent: { backgroundColor: colors.accent, borderColor: colors.accent, boxShadow: `0px 0px 0px 4px ${colors.accent}33` },
    ladderLine: { flex: 1, width: 2, minHeight: 18, backgroundColor: colors.border, marginVertical: 2 },
    ladderLineReached: { backgroundColor: colors.primary },
    ladderText: { flex: 1, minWidth: 0, paddingTop: 2 },
    ladderTextSpaced: { paddingBottom: 16 },
    ladderTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    ladderName: { fontSize: 15, fontWeight: '800', color: colors.text },
    ladderNameLocked: { color: colors.textSecondary, fontWeight: '700' },
    ladderXp: { ...Type.numeral, fontSize: 12, fontWeight: '700', color: colors.textTertiary, marginTop: 2 },
    ruleCard: { gap: 10 },
    ruleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    ruleTitle: { ...Type.headline, color: colors.text, flex: 1 },
    ruleText: { fontSize: 13, lineHeight: 19, color: colors.textSecondary },
    multipliers: { flexDirection: 'row', gap: 8 },
    multiplier: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.accent + '88',
      backgroundColor: colors.accentSubtle,
    },
    multiplierText: { ...Type.numeral, fontSize: 14, color: colors.accentText },
  });
}

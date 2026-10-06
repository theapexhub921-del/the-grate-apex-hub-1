import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { ExploreFeatureGroups } from '@/components/explore/feature-groups';
import { PwaInstallCard } from '@/components/pwa-install-card';
import { Card, Interactive } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { PageHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { isDesktopWidth, Type, type ThemeColors } from '@/constants/theme';
import { POWERUP_MULTIPLIERS, XP_RULES } from '@/data/learning/xp-rules';
import { useProgress } from '@/data/progress';
import { getRankProgress, LEAGUE_RULES, RANKS } from '@/data/ranks';
import { routes } from '@/lib/routes';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { EXPLORE_CONTACT, EXPLORE_GUIDE, EXPLORE_TEAM, getExploreAnnouncements, getItemsByCategory, type ExploreAnnouncement, type ExploreItem } from '@/data/explore';
import { ABOUT_US } from '@/data/about';

function GuideStep({ icon, number, title, detail }: { icon: IconName; number: string; title: string; detail: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <View style={styles.guideStep}>
      <View style={styles.guideStepIcon}><Icon name={icon} size={17} color={colors.primaryText} /></View>
      <View style={styles.guideStepCopy}>
        <Text style={styles.guideStepTitle}>{number} · {title}</Text>
        <Text style={styles.guideStepDetail}>{detail}</Text>
      </View>
    </View>
  );
}

function DiscoveryCard({ item }: { item: ExploreItem }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <Card style={styles.discoveryCard}>
      <View style={styles.discoveryTop}><Pill label={item.topic} tone="primary" />{item.category === 'research' ? <Pill label={item.research?.evidenceType ?? 'Research'} /> : null}</View>
      <Text style={styles.featureTitle}>{item.title}</Text>
      <Text style={styles.featureDescription}>{item.summary}</Text>
      {expanded ? (
        <View style={styles.discoveryDetails}>
          {item.connectionSteps?.length ? (
            <View style={styles.pathway}>
              {item.connectionSteps.map((step, index) => (
                <View key={step.label} style={styles.pathStep}>
                  <View style={styles.pathStepHead}><View style={styles.pathNode}><Text style={styles.pathNodeText}>{index + 1}</Text></View><Text style={styles.pathLabel}>{step.label}</Text></View>
                  <Text style={styles.featureDescription}>{step.detail}</Text>
                </View>
              ))}
            </View>
          ) : <Text style={styles.featureDescription}>{item.basicIdea}</Text>}
          {item.whyItMatters ? <View style={styles.detailBlock}><Text style={styles.detailLabel}>Why it matters</Text><Text style={styles.featureDescription}>{item.whyItMatters}</Text></View> : null}
          {item.research ? (
            <>
              <View style={styles.detailBlock}><Text style={styles.detailLabel}>What we know</Text><Text style={styles.featureDescription}>{item.research.whatWeKnow}</Text></View>
              <View style={styles.detailBlock}><Text style={styles.detailLabel}>What remains uncertain</Text><Text style={styles.featureDescription}>{item.research.whatRemainsUncertain}</Text></View>
              <Text style={styles.researchCaveat}>Supplementary research summary. It is not clinical guidance or authoritative course material.</Text>
            </>
          ) : null}
          {item.sources.map((source) => source.url ? (
            <Interactive key={source.url} onPress={() => void Linking.openURL(source.url!)} accessibilityRole="link" style={styles.sourceLink}>
              <Icon name="book" size={14} color={colors.primaryText} /><Text style={styles.sourceText}>{source.title}</Text>
            </Interactive>
          ) : <Text key={source.title} style={styles.sourceText}>{source.title}</Text>)}
          {item.action ? <Interactive onPress={() => router.push(item.action!.href as never)} accessibilityRole="link" style={styles.sourceLink}><Text style={styles.sourceText}>{item.action.label}</Text><Icon name="chevronRight" size={15} color={colors.primaryText} /></Interactive> : null}
        </View>
      ) : null}
      <Interactive onPress={() => setExpanded((value) => !value)} accessibilityRole="button" accessibilityLabel={`${expanded ? 'Collapse' : 'Explore'} ${item.title}`} style={styles.discoveryToggle}>
        <Text style={styles.discoveryToggleText}>{expanded ? 'Show less' : item.category === 'research' ? 'Read research summary' : 'Explore concept'}</Text>
        <Icon name={expanded ? 'chevronUp' : 'chevronDown'} size={16} color={colors.primaryText} />
      </Interactive>
    </Card>
  );
}

function GuideEntryCard({ item }: { item: (typeof EXPLORE_GUIDE)[number] }) {
  const styles = useThemedStyles(createStyles);
  const label = item.status === 'available' ? 'Available' : item.status === 'limited' ? 'In progress' : 'Coming soon';
  return <Card style={styles.guideEntry}><View style={styles.guideEntryHead}><Text style={styles.featureTitle}>{item.title}</Text><Pill label={label} tone={item.status === 'available' ? 'primary' : 'neutral'} /></View><Text style={styles.featureDescription}>{item.detail}</Text></Card>;
}

function AnnouncementCard({ item }: { item: ExploreAnnouncement }) {
  const styles = useThemedStyles(createStyles);
  const label = item.status === 'available' ? 'Available' : item.status === 'preview' ? 'Preview' : 'Coming soon';
  return <Card style={styles.announcementCard}><View style={styles.announcementHeader}><Icon name="sparkle" size={18} color="#0A1F5C" /><Pill label={`${new Date(`${item.publishedAt}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} · ${label}`} tone="gold" /></View><Text style={styles.featureTitle}>{item.title}</Text><Text style={styles.featureDescription}>{item.summary}</Text></Card>;
}

export default function ExploreScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();

  return (
    <Screen width="wide">
      <PageHeader eyebrow="The GrAteApex Hub guide" title="Explore" subtitle="A friendly guide to studying, connecting and growing with GrAteApex Hub." />

      <View style={styles.introGrid}>
        <Card style={styles.introCard}>
          <View style={styles.introBrand}><Icon name="sparkle" size={22} color={colors.accentText} /><Text style={styles.introLabel}>WELCOME TO GrAteApex Hub</Text></View>
          <Text style={styles.introTitle}>Learn your way. Rise together.</Text>
          <Text style={styles.introBody}>Bring your lecture material into focused lessons, practise with fresh questions, and return to concepts when they are due. Home is your social space for Stories and community posts. Explore explains every feature, shares updates and shows what is coming next.</Text>
          <View style={styles.introActions}>
            <Interactive onPress={() => router.push(routes.onboarding({ replay: true }))} accessibilityRole="button" style={styles.guideLink}>
              <Icon name="learn" size={16} color={colors.primaryText} /><Text style={styles.guideLinkText}>Replay the full introduction</Text>
            </Interactive>
            <Interactive onPress={() => void Linking.openURL(`mailto:${EXPLORE_CONTACT.email}?subject=${encodeURIComponent(EXPLORE_CONTACT.subject)}`)} accessibilityRole="link" style={styles.guideLink}>
              <Icon name="mail" size={16} color={colors.primaryText} /><Text style={styles.guideLinkText}>Questions or ideas? Contact us</Text>
            </Interactive>
          </View>
        </Card>
        <Card style={styles.guideCard} tone="insight">
          <Text style={styles.guideTitle}>Your quick guide</Text>
          <GuideStep icon="home" number="01" title="Home" detail="Post Stories, photos, videos and study moments. Like, comment on and reshare friends’ posts." />
          <GuideStep icon="lesson" number="02" title="Learn" detail="Follow lecture topics, build an optional study plan and use the review calendar." />
          <GuideStep icon="social" number="03" title="Connect" detail="Find classmates, create study groups, discuss assignments and message accepted friends." />
          <GuideStep icon="explore" number="04" title="Explore" detail="Learn what each feature does, see announcements and discover what’s being built." />
        </Card>
      </View>

      <SectionHeader title="Medical concepts" subtitle="A quick way into useful ideas that sit across the curriculum." style={styles.section} />
      <View style={styles.featureGrid}>{getItemsByCategory('concept').map((item) => <DiscoveryCard key={item.id} item={item} />)}</View>

      <SectionHeader title="Connections" subtitle="Follow a mechanism from foundational science to what it can mean in a clinical setting." style={styles.section} />
      <View style={styles.featureGrid}>{getItemsByCategory('connection').map((item) => <DiscoveryCard key={item.id} item={item} />)}</View>

      <SectionHeader title="Emerging research" subtitle="Peer-reviewed findings, dated and labelled by study design. Research here is supplemental and does not replace course material." style={styles.section} />
      <View style={styles.featureGrid}>{getItemsByCategory('research').map((item) => <DiscoveryCard key={item.id} item={item} />)}</View>

      <PwaInstallCard />
      <SectionHeader title="Explore by theme" subtitle="Related features are grouped together. Open a theme for details, or try a short interactive walkthrough." style={styles.section} />
      <ExploreFeatureGroups />
      <SectionHeader title="GrAteApex Hub feature guide" subtitle="A plain-language guide to the app, its systems and the features you can explore." style={styles.section} />
      <View style={styles.featureGrid}>{EXPLORE_GUIDE.map((item) => <GuideEntryCard key={item.title} item={item} />)}</View>
      <SectionHeader title="What's New" subtitle="Dated product updates, kept separate from medical research." style={styles.section} />
      <View style={styles.featureGrid}>{getExploreAnnouncements().map((item) => <AnnouncementCard key={item.id} item={item} />)}</View>

      <SectionHeader title="About GrAteApex Hub" subtitle="A learning companion built around your course material and your study circle." style={styles.section} />
      <Card style={styles.aboutCard}>
        <Text style={styles.featureDescription}>{ABOUT_US}</Text>
      </Card>

      <SectionHeader title="Meet the team" subtitle="The people building and supporting GrAteApex Hub." style={styles.section} />
      <View style={styles.featureGrid}>
        {EXPLORE_TEAM.map((member) => <Card key={member.name} style={styles.teamCard}>
          <View style={styles.featureIcon}><Icon name={member.icon} size={19} color={colors.primaryText} /></View>
          <Text style={styles.featureTitle}>{member.name}</Text>
          <Text style={styles.featureDescription}>{member.role}</Text>
        </Card>)}
      </View>
      <Card style={[styles.aboutCard, styles.contactCard]}>
        <Text style={styles.featureTitle}>Contact us</Text>
        <Text style={styles.featureDescription}>Send the GrAteApex Hub team a question, idea or feedback.</Text>
        <Interactive onPress={() => void Linking.openURL(`mailto:${EXPLORE_CONTACT.email}?subject=${encodeURIComponent(EXPLORE_CONTACT.subject)}`)} accessibilityRole="link" style={styles.guideLink}>
          <Icon name="mail" size={16} color={colors.primaryText} /><Text style={styles.guideLinkText}>Email the GrAteApex Hub team</Text>
        </Interactive>
      </Card>

      <Journey />
    </Screen>
  );
}

// "The GrAteApex Hub journey" — the one place the full rank ladder is revealed.
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
        title="The GrAteApex Hub journey"
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
    introGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    introCard: { flex: 1.35, minWidth: 300, gap: 12, padding: 24 },
    guideCard: { flex: 1, minWidth: 280, gap: 15, padding: 22 },
    introBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    introLabel: { ...Type.overline, color: colors.accentText },
    introTitle: { ...Type.title1, color: colors.text },
    introBody: { fontSize: 14, lineHeight: 21, color: colors.textSecondary },
    introActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
    guideLink: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.primarySubtle },
    guideLinkText: { fontSize: 13, fontWeight: '700', color: colors.primaryText },
    guideTitle: { ...Type.title3, color: colors.text },
    guideStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    guideStepIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySubtle },
    guideStepCopy: { flex: 1, gap: 2 },
    guideStepTitle: { fontSize: 13, fontWeight: '800', color: colors.text },
    guideStepDetail: { fontSize: 12, lineHeight: 17, color: colors.textSecondary },
    featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    featureCard: { flexBasis: '31%', flexGrow: 1, minWidth: 230, gap: 9, padding: 16 },
    featureTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    featureIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    featureTitle: { ...Type.headline, color: colors.text },
    featureDescription: { fontSize: 13, lineHeight: 19, color: colors.textSecondary },
    announcementCard: { flexBasis: '48%', flexGrow: 1, minWidth: 270, gap: 10, padding: 18 },
    announcementHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    aboutCard: { gap: 12, padding: 18 },
    contactCard: { marginTop: 14 },
    widgetCard: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 14, padding: 18 },
    widgetCopy: { flex: 1, minWidth: 260, gap: 5 },
    teamCard: { flex: 1, minWidth: 180, gap: 10, padding: 18 },
    discoveryCard: { flexBasis: '48%', flexGrow: 1, minWidth: 280, gap: 11, padding: 18 },
    discoveryTop: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
    discoveryDetails: { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 12, gap: 12 },
    discoveryToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 11 },
    discoveryToggleText: { fontSize: 13, fontWeight: '800', color: colors.primaryText },
    pathway: { gap: 10 },
    pathStep: { gap: 5, borderLeftWidth: 1.5, borderLeftColor: colors.primaryBorder, marginLeft: 12, paddingLeft: 14, paddingBottom: 3 },
    pathStepHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    pathNode: { width: 23, height: 23, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySubtle },
    pathNodeText: { fontSize: 11, fontWeight: '800', color: colors.primaryText },
    pathLabel: { fontSize: 13, fontWeight: '800', color: colors.text },
    detailBlock: { gap: 4 },
    detailLabel: { fontSize: 12, fontWeight: '800', color: colors.text },
    researchCaveat: { fontSize: 11, lineHeight: 16, color: colors.textTertiary },
    sourceLink: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', paddingVertical: 4 },
    sourceText: { fontSize: 12, lineHeight: 17, color: colors.primaryText, flexShrink: 1, fontWeight: '700' },
    guideEntry: { flexBasis: '31%', flexGrow: 1, minWidth: 250, gap: 8, padding: 15 },
    guideEntryHead: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 7 },

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

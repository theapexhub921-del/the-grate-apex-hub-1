import { LegalPage } from '@/components/legal-page';

// GRATEAPEX privacy policy (public: /privacy). Keep it in step with what
// the app actually stores — see supabase/migrations and data/social.ts.
export default function PrivacyScreen() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="5 October 2026"
      intro="GrAteApex Hub is a learning app for medical students, developed by OrigiNate. This policy explains what we collect when you use GrAteApex Hub, why, and the choices you have."
      sections={[
        {
          title: 'What we collect',
          points: [
            'Account: your email address and password. Passwords are stored only as a secure one-way hash by our authentication provider — nobody at GrAteApex Hub can read them.',
            'If you continue with Google: your name, email address and profile picture link from your Google account. We never receive your Google password or any other Google data.',
            'Profile: your display name, username, avatar and your activity-sharing choice.',
            'Learning: lessons you complete, XP, quiz and question answers and scores, your review schedule and streak, and a timeline of learning events (for example, “lesson completed”).',
            'Social: your friends, friend requests and notifications.',
          ],
        },
        {
          title: 'Why we use it',
          points: [
            'To create your account and keep you signed in.',
            'To save your progress so it follows you to any device.',
            'To schedule reviews and suggest what to study next.',
            'To let you find classmates and see your friends’ progress.',
          ],
          paragraphs: ['We do not sell your data, show ads, or use your data for advertising.'],
        },
        {
          title: 'What other learners can see',
          paragraphs: [
            'Learners you are friends with can see your name, username, avatar, weekly XP, total XP and streak. If activity sharing is on, they also see when you complete a lesson, a topic or the Apex Challenge. Other learners can find you by username or name when they search. Nobody else can see your answers, scores, email address or account details.',
          ],
        },
        {
          title: 'Where your data is kept',
          paragraphs: [
            'Your account and learning data are stored with Supabase, our database and authentication provider, and protected by access rules so each learner can only read their own private data. The web app is hosted by Vercel. Google is used only if you choose to sign in with Google.',
          ],
        },
        {
          title: 'How long we keep it, and deleting it',
          paragraphs: [
            'We keep your data while your account exists. You can permanently delete your account and all of its data at any time in Settings → Account → Delete account. You can also turn off activity sharing on the Friends page.',
          ],
        },
        {
          title: 'Contact',
          paragraphs: ['Questions or requests about your data: theapexhub921@gmail.com.'],
        },
        {
          title: 'Changes',
          paragraphs: ['If we change this policy, we will update the date at the top of this page.'],
        },
      ]}
    />
  );
}

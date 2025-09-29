/**
 * Production Seed Script for Binder Web
 * Creates demo accounts and sample content for live demo
 *
 * Usage: pnpm tsx scripts/seed-production.ts
 */

import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function seedProduction() {
  console.log("🌱 Starting production seed...");

  try {
    // Create demo users in Supabase Auth
    console.log("👤 Creating demo users...");

    const demoUsers = [
      {
        email: "demo1@binder-web.com",
        phone: "+628111111111",
        profile: {
          displayName: "Demo User One",
          username: "demo1",
          avatarEmoji: "🚀",
          avatarColor: "#3b82f6",
        },
      },
      {
        email: "demo2@binder-web.com",
        phone: "+628222222222",
        profile: {
          displayName: "Demo User Two",
          username: "demo2",
          avatarEmoji: "🌟",
          avatarColor: "#10b981",
        },
      },
      {
        email: "demo3@binder-web.com",
        phone: "+628333333333",
        profile: {
          displayName: "Demo User Three",
          username: "demo3",
          avatarEmoji: "🎯",
          avatarColor: "#f59e0b",
        },
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      // Create auth user
      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email: userData.email,
          phone: userData.phone,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: {
            display_name: userData.profile.displayName,
            username: userData.profile.username,
            avatar_emoji: userData.profile.avatarEmoji,
            avatar_color: userData.profile.avatarColor,
          },
        });

      if (authError) {
        console.error(`Error creating user ${userData.email}:`, authError);
        continue;
      }

      // Create profile in database
      const profile = await prisma.profile.upsert({
        where: { userId: authUser.user.id },
        update: userData.profile,
        create: {
          userId: authUser.user.id,
          ...userData.profile,
        },
      });

      createdUsers.push({ authUser: authUser.user, profile });
      console.log(
        `✅ Created user: ${userData.profile.displayName} (${userData.profile.username})`,
      );
    }

    // Create demo groups
    console.log("👥 Creating demo groups...");

    const demoGroup1 = await prisma.group.create({
      data: {
        name: "Welcome to Binder Web",
        description: "Demo group showcasing all features",
        ownerId: createdUsers[0].authUser.id,
        inviteCode: "DEMO2025",
        avatarEmoji: "🎉",
        avatarColor: "#8b5cf6",
      },
    });

    const demoGroup2 = await prisma.group.create({
      data: {
        name: "Project Collaboration",
        description: "Example of team collaboration space",
        ownerId: createdUsers[1].authUser.id,
        inviteCode: "TEAM2025",
        avatarEmoji: "💼",
        avatarColor: "#f59e0b",
      },
    });

    console.log("✅ Created demo groups");

    // Add all users to both groups
    console.log("🔗 Creating group memberships...");

    for (const group of [demoGroup1, demoGroup2]) {
      for (let i = 0; i < createdUsers.length; i++) {
        const user = createdUsers[i];
        const isOwner = group.ownerId === user.authUser.id;

        await prisma.groupMember.create({
          data: {
            groupId: group.id,
            userId: user.authUser.id,
            role: isOwner ? "owner" : "member",
          },
        });
      }
    }

    // Create demo messages
    console.log("💬 Creating demo messages...");

    const demoMessages = [
      {
        groupId: demoGroup1.id,
        userId: createdUsers[0].authUser.id,
        content:
          "Welcome to Binder Web! 👋 This is a demo of our real-time messaging system.",
      },
      {
        groupId: demoGroup1.id,
        userId: createdUsers[1].authUser.id,
        content:
          "Hey! This looks amazing! Love the clean interface and smooth animations.",
      },
      {
        groupId: demoGroup1.id,
        userId: createdUsers[2].authUser.id,
        content:
          "The emoji avatars are such a nice touch! 🎨 And the real-time updates work perfectly.",
      },
      {
        groupId: demoGroup1.id,
        userId: createdUsers[0].authUser.id,
        content:
          "Try creating a note in this group! Our collaborative notes system supports rich content blocks.",
      },
      {
        groupId: demoGroup2.id,
        userId: createdUsers[1].authUser.id,
        content:
          "This group demonstrates team collaboration features. Perfect for project planning!",
      },
    ];

    for (const messageData of demoMessages) {
      await prisma.message.create({ data: messageData });
    }

    console.log("✅ Created demo messages");

    // Create demo notes
    console.log("📝 Creating demo notes...");

    const demoNote1 = await prisma.note.create({
      data: {
        title: "Welcome to Binder Notes",
        groupId: demoGroup1.id,
        authorId: createdUsers[0].authUser.id,
        status: "published",
      },
    });

    const demoNote2 = await prisma.note.create({
      data: {
        title: "Project Planning Template",
        groupId: demoGroup2.id,
        authorId: createdUsers[1].authUser.id,
        status: "published",
      },
    });

    // Create note blocks
    const noteBlocks = [
      // Note 1 blocks
      {
        noteId: demoNote1.id,
        order: 0,
        type: "HEADING",
        content: "What is Binder Web?",
      },
      {
        noteId: demoNote1.id,
        order: 1,
        type: "PARAGRAPH",
        content:
          "Binder Web is a modern group chat and collaborative notes platform. Built with Next.js, it offers real-time messaging, structured notes, and beautiful user experience.",
      },
      {
        noteId: demoNote1.id,
        order: 2,
        type: "HEADING",
        content: "Key Features",
      },
      {
        noteId: demoNote1.id,
        order: 3,
        type: "LIST",
        content:
          "• Real-time group messaging with typing indicators\n• Block-based collaborative notes\n• Emoji avatars with customizable colors\n• Mobile-first PWA design\n• Professional UX with smooth animations",
      },
      // Note 2 blocks
      {
        noteId: demoNote2.id,
        order: 0,
        type: "HEADING",
        content: "Project Planning Checklist",
      },
      {
        noteId: demoNote2.id,
        order: 1,
        type: "LIST",
        content:
          "• Define project scope and objectives\n• Assign team roles and responsibilities\n• Set timeline and milestones\n• Establish communication protocols\n• Plan regular check-ins and reviews",
      },
      {
        noteId: demoNote2.id,
        order: 2,
        type: "PARAGRAPH",
        content:
          "This template demonstrates how teams can use Binder notes for structured project planning and collaboration.",
      },
    ];

    for (const block of noteBlocks) {
      await prisma.noteBlock.create({ data: block });
    }

    console.log("✅ Created demo notes with blocks");

    console.log("\n🎉 Production seed complete!");
    console.log("\n📋 Demo Accounts:");
    console.log("   👤 demo1@binder-web.com (Demo User One) 🚀");
    console.log("   👤 demo2@binder-web.com (Demo User Two) 🌟");
    console.log("   👤 demo3@binder-web.com (Demo User Three) 🎯");
    console.log("\n🏠 Demo Groups:");
    console.log("   🎉 Welcome to Binder Web (DEMO2025)");
    console.log("   💼 Project Collaboration (TEAM2025)");
    console.log("\n🚀 Ready for live demo!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if called directly
if (require.main === module) {
  seedProduction();
}

export { seedProduction };

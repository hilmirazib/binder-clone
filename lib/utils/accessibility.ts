// Accessibility utilities and constants for M8 polish

export const ARIA_LABELS = {
  // Navigation
  MAIN_NAV: "Main navigation",
  BACK_BUTTON: "Go back to previous page",
  MENU_BUTTON: "Open menu",
  CLOSE_BUTTON: "Close dialog",

  // Groups
  CREATE_GROUP: "Create new group",
  JOIN_GROUP: "Join group by invite code",
  LEAVE_GROUP: "Leave this group",
  DELETE_GROUP: "Delete this group permanently",
  GROUP_SETTINGS: "Open group settings",
  GROUP_MEMBERS: "View group members",

  // Messaging
  MESSAGE_INPUT: "Type your message here",
  SEND_MESSAGE: "Send message to group",
  MESSAGE_FROM: "Message from",
  TYPING_INDICATOR: "Someone is typing",
  SCROLL_TO_BOTTOM: "Scroll to latest messages",

  // Notes
  CREATE_NOTE: "Create new note",
  EDIT_NOTE: "Edit this note",
  DELETE_NOTE: "Delete this note",
  NOTE_TITLE: "Note title",
  ADD_BLOCK: "Add new content block",
  MOVE_BLOCK: "Drag to reorder block",

  // Profile
  EDIT_PROFILE: "Edit your profile information",
  CHANGE_AVATAR: "Change profile avatar",
  SAVE_PROFILE: "Save profile changes",
  AVATAR_PREVIEW: "Profile avatar preview",
};

export const KEYBOARD_SHORTCUTS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
  HOME: "Home",
  END: "End",
};

// Touch target size validator (minimum 44px for WCAG compliance)
export function validateTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44;
  return rect.width >= minSize && rect.height >= minSize;
}

// Audit all touch targets on page
export function auditTouchTargets(): {
  valid: HTMLElement[];
  invalid: HTMLElement[];
  report: string;
} {
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])',
  );

  const valid: HTMLElement[] = [];
  const invalid: HTMLElement[] = [];

  interactiveElements.forEach((el) => {
    const element = el as HTMLElement;
    if (validateTouchTarget(element)) {
      valid.push(element);
    } else {
      invalid.push(element);
      console.warn("Invalid touch target:", element, {
        size: element.getBoundingClientRect(),
        minRequired: "44x44px",
      });
    }
  });

  const report = `Touch Target Audit:
✅ Valid: ${valid.length} elements
❌ Invalid: ${invalid.length} elements
📊 Compliance: ${Math.round((valid.length / interactiveElements.length) * 100)}%`;

  return { valid, invalid, report };
}

// Focus management utilities
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== KEYBOARD_SHORTCUTS.TAB) return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    }
  }

  container.addEventListener("keydown", handleKeyDown);
  firstElement?.focus();

  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}

// Screen reader announcements
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite",
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

// Keyboard navigation helper
export function handleArrowKeyNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelectionChange: (newIndex: number) => void,
) {
  switch (event.key) {
    case KEYBOARD_SHORTCUTS.ARROW_DOWN:
      event.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      onSelectionChange(nextIndex);
      items[nextIndex]?.focus();
      break;

    case KEYBOARD_SHORTCUTS.ARROW_UP:
      event.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      onSelectionChange(prevIndex);
      items[prevIndex]?.focus();
      break;

    case KEYBOARD_SHORTCUTS.HOME:
      event.preventDefault();
      onSelectionChange(0);
      items[0]?.focus();
      break;

    case KEYBOARD_SHORTCUTS.END:
      event.preventDefault();
      const lastIndex = items.length - 1;
      onSelectionChange(lastIndex);
      items[lastIndex]?.focus();
      break;
  }
}

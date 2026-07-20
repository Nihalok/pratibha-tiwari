# Security Specification - Pratibha Tiwari Platform

## Data Invariants
1. Posts must have a valid slug and authorId. Only admins can create/edit posts.
2. Messages can be created by anyone, but only read/managed by admins.
3. Testimonials can be read by anyone, but only managed by admins.
4. Admins collection is read-only for authenticated users (to check their own status), but only writeable by existing admins or via a bootstrap process.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Unauthenticated Post Creation**: Attempting to `create` a post without being logged in.
2. **Unauthorized Role Escalation**: A non-admin user trying to create an `admins` document for themselves.
3. **Draft Post Leak**: A public user trying to `list` posts where `status == 'draft'`.
4. **Message Modification**: A public user trying to `update` a message they sent (messages should be immutable for users).
5. **PII Exposure**: A public user trying to `list` all messages (PII leak).
6. **Toxic Content Injection**: A post with a 2MB body field (exceeding Firestore limits or budget).
7. **Identity Spoofing**: A user trying to create a post with an `authorId` that is not theirs.
8. **Invalid ID Injection**: A request targeting a document ID with junk characters/escaped sequences.
9. **Timestamp Deception**: A client providing a `createdAt` date from 10 years ago instead of the server time.
10. **State Skipping**: Updating a message status from `unread` directly to some invalid status.
11. **Testimonial Injection**: A anonymous user trying to seed fake testimonials.
12. **Admin Data Deletion**: A non-admin user trying to `delete` a post.

## Test Runner (Logic Check)
- `PERMISSION_DENIED` for all above payloads.
- `ALLOW` for:
    - Public `get` on `published` posts.
    - Public `create` on `messages`.
    - Admin `list/get/create/update/delete` on everything.

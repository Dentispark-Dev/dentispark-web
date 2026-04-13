const fs = require('fs');
const files = [
  "src/features/(dashboard)/admin/components/standalone-initiate-order-modal.tsx",
  "src/features/(mentor-dashboard)/bookings/components/booking-calendar.tsx",
  "src/features/(mentor-dashboard)/profile-settings/components/edit-personal-info-modal.tsx"
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{\s*[\r\n]+import \{ LooseRecord \} from "@\/src\/types\/loose";/g, 'import { LooseRecord } from "@/src/types/loose";\nimport {');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed ${file}`);
}

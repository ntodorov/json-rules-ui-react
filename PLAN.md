# JSON Rules Engine UI - React Application Plan

## Overview

A modern React application serving as a visual editor and tester for the `json-rules-engine` npm package. This application enables users to define Facts, create Rules with complex Conditions, and test rule execution with custom fact values.

---

## Technology Stack

### Core

- **React 18+** with TypeScript
- **Vite** - Fast build tool and dev server
- **json-rules-engine** - Core rules engine package

### UI Framework & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible component library
- **Lucide React** - Icon library
- **Framer Motion** - Smooth animations

### State Management

- **Zustand** - Lightweight state management
- **Immer** - Immutable state updates

### Forms & Validation

- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Utilities

- **uuid** - Unique ID generation
- **react-hot-toast** - Toast notifications
- **@dnd-kit/core** - Drag and drop for rule ordering

---

## Data Models

### Fact Definition

```typescript
interface FactDefinition {
  id: string;
  name: string; // Fact identifier used in conditions
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: any; // Optional default value
  description?: string; // Human-readable description
}
```

### Condition

```typescript
interface Condition {
  id: string;
  fact: string; // Reference to a FactDefinition.name
  operator: OperatorType;
  value: any;
  path?: string; // Optional JSON path (e.g., '$.property')
  params?: Record<string, any>;
}

interface ConditionGroup {
  id: string;
  type: 'all' | 'any' | 'not';
  conditions: (Condition | ConditionGroup)[];
}

type OperatorType =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessThanInclusive'
  | 'greaterThan'
  | 'greaterThanInclusive'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'doesNotContain';
```

### Event

```typescript
interface RuleEvent {
  type: string; // Event type identifier
  params?: Record<string, any>; // Custom parameters
}
```

### Rule

```typescript
interface Rule {
  id: string;
  name: string;
  description?: string;
  priority: number; // Higher = runs first (default: 1)
  conditions: ConditionGroup;
  event: RuleEvent;
  enabled: boolean;
}
```

### Engine State

```typescript
interface EngineState {
  facts: FactDefinition[];
  rules: Rule[];
  lastRunResult?: EngineRunResult;
}

interface EngineRunResult {
  events: RuleEvent[]; // Triggered events
  results: RuleResult[]; // Detailed results per rule
  timestamp: Date;
}
```

---

## Application Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── facts/
│   │   ├── FactsPanel.tsx          # Main facts section
│   │   ├── FactCard.tsx            # Individual fact display
│   │   ├── FactForm.tsx            # Add/edit fact form
│   │   └── FactTypeSelector.tsx    # Type dropdown
│   │
│   ├── rules/
│   │   ├── RulesPanel.tsx          # Main rules section
│   │   ├── RuleCard.tsx            # Collapsible rule card
│   │   ├── RuleForm.tsx            # Add/edit rule form
│   │   └── RuleList.tsx            # Draggable rule list
│   │
│   ├── conditions/
│   │   ├── ConditionBuilder.tsx    # Main condition builder
│   │   ├── ConditionGroup.tsx      # all/any/not group
│   │   ├── ConditionRow.tsx        # Single condition editor
│   │   ├── OperatorSelect.tsx      # Operator dropdown
│   │   └── ValueInput.tsx          # Dynamic value input
│   │
│   ├── events/
│   │   ├── EventEditor.tsx         # Event type & params editor
│   │   └── EventParamsEditor.tsx   # Key-value params editor
│   │
│   ├── execution/
│   │   ├── RunEngineButton.tsx     # Trigger engine run
│   │   ├── FactValuesModal.tsx     # Pre-run facts input popup
│   │   ├── ResultsPanel.tsx        # Display execution results
│   │   └── EventsTimeline.tsx      # Visual timeline of events
│   │
│   └── common/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Badge.tsx
│       ├── Tooltip.tsx
│       └── JsonViewer.tsx          # JSON display component
│
├── hooks/
│   ├── useEngine.ts                # Engine operations
│   ├── useFacts.ts                 # Fact CRUD operations
│   ├── useRules.ts                 # Rule CRUD operations
│   └── useEngineRunner.ts          # Engine execution
│
├── store/
│   ├── engineStore.ts              # Zustand store
│   └── types.ts                    # Store types
│
├── lib/
│   ├── engine.ts                   # json-rules-engine wrapper
│   ├── validators.ts               # Zod schemas
│   ├── operators.ts                # Operator definitions
│   └── utils.ts                    # Helper functions
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## UI Layout Design

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Header: JSON Rules Engine Editor                        [Run Engine ▶]  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  FACTS DEFINITION                                    [+ Add Fact]   │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │ │
│  │  │ age          │ │ country      │ │ purchases    │                 │ │
│  │  │ Type: number │ │ Type: string │ │ Type: array  │                 │ │
│  │  │ [Edit] [Del] │ │ [Edit] [Del] │ │ [Edit] [Del] │                 │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                 │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  RULES                                               [+ Add Rule]   │ │
│  ├─────────────────────────────────────────────────────────────────────┤ │
│  │                                                                      │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐│ │
│  │  │ ▼ Rule: Senior Discount                     Priority: 10  [ON]  ││ │
│  │  ├─────────────────────────────────────────────────────────────────┤│ │
│  │  │  CONDITIONS                                                      ││ │
│  │  │  ┌─────────────────────────────────────────────────────────────┐││ │
│  │  │  │ ALL of the following:                      [+ Add Condition]│││ │
│  │  │  │  ┌──────────────────────────────────────────────────────┐  │││ │
│  │  │  │  │ [age ▼] [greaterThanInclusive ▼] [65    ] [×]        │  │││ │
│  │  │  │  └──────────────────────────────────────────────────────┘  │││ │
│  │  │  │  ┌──────────────────────────────────────────────────────┐  │││ │
│  │  │  │  │ ANY of the following:                   [+ Condition] │  │││ │
│  │  │  │  │   [country ▼] [equal ▼] ["US"   ] [×]                │  │││ │
│  │  │  │  │   [country ▼] [equal ▼] ["CA"   ] [×]                │  │││ │
│  │  │  │  └──────────────────────────────────────────────────────┘  │││ │
│  │  │  └─────────────────────────────────────────────────────────────┘││ │
│  │  │                                                                  ││ │
│  │  │  EVENT                                                           ││ │
│  │  │  ┌─────────────────────────────────────────────────────────────┐││ │
│  │  │  │ Type: [senior-discount      ]                               │││ │
│  │  │  │ Params: { "discount": 0.15, "message": "Senior discount!" } │││ │
│  │  │  └─────────────────────────────────────────────────────────────┘││ │
│  │  └─────────────────────────────────────────────────────────────────┘│ │
│  │                                                                      │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐│ │
│  │  │ ▶ Rule: Bulk Purchase Bonus                  Priority: 5   [ON] ││ │
│  │  └─────────────────────────────────────────────────────────────────┘│ │
│  │                                                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Details

### 1. Facts Panel (Top Section)

**Features:**

- Grid/list view of defined facts
- Add new fact via modal/inline form
- Edit existing facts
- Delete facts (with dependency warning if used in rules)
- Fact types: `string`, `number`, `boolean`, `array`, `object`
- Optional default values
- Optional descriptions

**Validation:**

- Unique fact names
- Valid default value for type

---

### 2. Rules Panel (Main Section)

**Features:**

- Collapsible rule cards
- Drag & drop to reorder rules by priority
- Toggle rule enabled/disabled
- Duplicate rule
- Delete rule
- Export/Import rule JSON

**Rule Card Contains:**

- Name and description
- Priority indicator
- Enabled toggle
- Conditions builder
- Event editor

---

### 3. Condition Builder

**Features:**

- Visual nested condition builder
- Support for `all`, `any`, `not` boolean operators
- Unlimited nesting depth
- Drag & drop conditions
- Add condition/group buttons

**Condition Row:**

- Fact selector (dropdown with defined facts)
- Operator selector (contextual based on fact type)
- Value input (dynamic based on operator)
- Optional `path` field for object/array facts
- Remove button

**Operators by Type:**
| Fact Type | Available Operators |
|-----------|-------------------|
| string | equal, notEqual, in, notIn |
| number | equal, notEqual, lessThan, lessThanInclusive, greaterThan, greaterThanInclusive, in, notIn |
| boolean | equal, notEqual |
| array | contains, doesNotContain |
| object | equal, notEqual (with path) |

---

### 4. Event Editor

**Features:**

- Event type input (required)
- Dynamic key-value params editor
- Add/remove params
- JSON preview

---

### 5. Engine Runner

**Pre-Run Modal:**

```
┌─────────────────────────────────────────────────────────────┐
│  Enter Fact Values                                    [×]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  age (number)                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 67                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  country (string)                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ US                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  purchases (array)                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ["item1", "item2", "item3"]                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                               [Cancel]  [Run Engine ▶]      │
└─────────────────────────────────────────────────────────────┘
```

**Results Display:**

- Success/failure status per rule
- List of triggered events
- Detailed rule results with condition outcomes
- Execution time
- JSON export of results

---

## User Flows

### Flow 1: Define Facts

1. Click "+ Add Fact"
2. Enter fact name, select type
3. Optionally add default value and description
4. Save fact
5. Fact appears in Facts panel

### Flow 2: Create Rule

1. Click "+ Add Rule"
2. Enter rule name and optional description
3. Set priority (default: 1)
4. Build conditions using condition builder
5. Configure event type and params
6. Save rule

### Flow 3: Build Conditions

1. Select root condition type (all/any/not)
2. Click "+ Add Condition" to add condition row
3. Select fact from dropdown
4. Select appropriate operator
5. Enter value
6. Optionally add nested groups

### Flow 4: Run Engine

1. Click "Run Engine" button in header
2. Modal appears with all defined facts
3. Enter values for each fact
4. Click "Run Engine"
5. Results panel shows:
   - Triggered events
   - Rule-by-rule results
   - Condition evaluations

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Project setup (Vite + React + TypeScript)
- [ ] Install dependencies
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Create basic layout components
- [ ] Set up Zustand store with types
- [ ] Implement basic Facts panel (CRUD)

### Phase 2: Rules & Conditions (Week 2)

- [ ] Implement Rules panel
- [ ] Build Condition Builder component
- [ ] Implement nested condition groups
- [ ] Add all operators
- [ ] Build Event editor

### Phase 3: Engine Integration (Week 3)

- [ ] Create json-rules-engine wrapper
- [ ] Build pre-run modal
- [ ] Implement engine execution
- [ ] Build results display panel
- [ ] Add success/failure visualization

### Phase 4: Polish & Features (Week 4)

- [ ] Add drag & drop for rules
- [ ] Implement import/export (JSON)
- [ ] Add validation & error handling
- [ ] Keyboard shortcuts
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Local storage persistence

---

## Bonus Features (Future)

1. **Templates**: Pre-built rule templates
2. **Version History**: Undo/redo for changes
3. **Rule Testing**: Individual rule testing
4. **Batch Testing**: Multiple test cases
5. **Rule Dependencies**: Visual dependency graph
6. **Code Export**: Generate JS/TS code
7. **API Integration**: Save/load from backend
8. **Collaboration**: Real-time editing
9. **Custom Operators**: Define custom operators
10. **Condition Preview**: Natural language condition preview

---

## Sample Data for Testing

```json
{
  "facts": [
    { "id": "1", "name": "age", "type": "number", "description": "User age" },
    {
      "id": "2",
      "name": "country",
      "type": "string",
      "description": "User country"
    },
    {
      "id": "3",
      "name": "purchaseCount",
      "type": "number",
      "description": "Total purchases"
    },
    {
      "id": "4",
      "name": "membershipTier",
      "type": "string",
      "description": "Gold, Silver, Bronze"
    }
  ],
  "rules": [
    {
      "id": "rule-1",
      "name": "Senior Discount",
      "priority": 10,
      "enabled": true,
      "conditions": {
        "id": "cg-1",
        "type": "all",
        "conditions": [
          {
            "id": "c-1",
            "fact": "age",
            "operator": "greaterThanInclusive",
            "value": 65
          }
        ]
      },
      "event": {
        "type": "apply-discount",
        "params": { "discount": 0.15, "reason": "Senior discount" }
      }
    }
  ]
}
```

---

## Commands Reference

```bash
# Create project
npm create vite@latest json-rules-ui -- --template react-ts

# Install dependencies
npm install json-rules-engine zustand immer uuid
npm install react-hook-form @hookform/resolvers zod
npm install @dnd-kit/core @dnd-kit/sortable
npm install framer-motion react-hot-toast
npm install lucide-react

# Tailwind & shadcn
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init

# Dev server
npm run dev

# Build
npm run build
```

---

## Notes

- All state is managed client-side with Zustand
- Local storage for persistence between sessions
- json-rules-engine runs entirely in the browser
- No backend required for core functionality
- Responsive design for tablet/desktop use

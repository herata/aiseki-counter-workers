# Product Context - 相席カウンター Dashboard

## Why This Project Exists

### Business Context
相席カウンター (Aiseki Counter) restaurants are a unique Japanese dining concept where single customers are seated together at shared tables to facilitate social interactions and potential romantic connections. This creates a specialized business model that requires careful management of customer flow and gender balance.

### Problems Being Solved

#### 1. Operational Visibility Gap
- **Problem**: Restaurant managers lacked real-time visibility into customer demographics and flow patterns
- **Impact**: Suboptimal seating arrangements, imbalanced gender ratios, missed revenue opportunities
- **Solution**: Real-time dashboard showing male/female visitor counts throughout the day

#### 2. Trend Analysis Deficit
- **Problem**: No easy way to compare current performance with historical data
- **Impact**: Difficulty identifying successful patterns or concerning trends
- **Solution**: Week-over-week comparison visualization with clear trend indicators

#### 3. Multi-Location Management Complexity
- **Problem**: Managing multiple restaurant locations across different prefectures manually
- **Impact**: Inconsistent service quality, inefficient resource allocation
- **Solution**: Centralized dashboard with prefecture and store selection capabilities

## How It Should Work

### User Journey
1. **Quick Setup**: User selects prefecture and store from intuitive dropdowns
2. **Smart Defaults**: System automatically selects appropriate date (yesterday before 6PM, today after 6PM)
3. **Instant Insights**: Charts load immediately showing current day visitor patterns
4. **Comparative Analysis**: Previous week data displayed as dashed lines for easy comparison
5. **Mobile Access**: Full functionality available on mobile devices for on-site management

### Core User Experience Goals

#### Simplicity First
- Minimal cognitive load - essential information prominently displayed
- No unnecessary UI elements or distracting decorations
- One-click access to most common tasks

#### Speed & Responsiveness
- Sub-second chart rendering
- Optimistic UI updates
- Progressive loading for better perceived performance

#### Context Awareness
- Smart date selection based on time of day
- Prevent future date selection (business logic constraint)
- Auto-close calendar after selection (friction reduction)

#### Visual Clarity
- Clear gender-based color coding (blue for male, red for female)
- Distinct styling for current vs. historical data (solid vs. dashed lines)
- Responsive text sizing and layout adaptation

## Target Users

### Primary: Restaurant Managers
- **Needs**: Quick access to current day performance metrics
- **Frequency**: Multiple times per day
- **Context**: Often mobile, quick decision-making scenarios

### Secondary: Regional Coordinators
- **Needs**: Compare performance across multiple locations
- **Frequency**: Weekly analysis and reporting
- **Context**: Tablet/desktop, detailed analysis workflows

### Tertiary: Business Analysts
- **Needs**: Historical trend analysis and reporting
- **Frequency**: Monthly/quarterly deep dives
- **Context**: Desktop, export and presentation requirements

The dashboard successfully addresses these needs through its clean interface, smart defaults, and efficient data visualization approach.

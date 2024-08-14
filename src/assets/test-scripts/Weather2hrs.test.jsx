import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi,describe,beforeEach, test, expect, global } from 'vitest';
import Weather2hrs from '../components/Weather2hrs';
import { get2hrAirtable, saveAreaName} from '../services/atableServices';

// Mock the services
vi.mock('../services/atableServices', () => ({
  get2hrAirtable: vi.fn(),
  saveAreaName: vi.fn(),
  deleteAreaName: vi.fn(),
}));

describe('Weather2hrs Component', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<Weather2hrs />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error message when API call fails', async () => {
    // Mock the API to return an error
    get2hrAirtable.mockRejectedValue(new Error('Failed to fetch'));

    render(<Weather2hrs />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('renders area cards when data is loaded', async () => {
    // Mock successful Airtable and weather API calls
    get2hrAirtable.mockResolvedValue([
      { id: 'rec1', fields: { name: 'Bishan' } },
      { id: 'rec2', fields: { name: 'Ang Mo Kio' } },
    ]);

    const mockWeatherData = {
      data: {
        items: [{ timestamp: '2024-08-08T10:00:00Z', forecasts: [] }],
        area_metadata: [
          { name: 'Bishan', label_location: { latitude: 1.35, longitude: 103.85 } },
          { name: 'Ang Mo Kio', label_location: { latitude: 1.37, longitude: 103.85 } },
        ],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    render(<Weather2hrs />);

    await waitFor(() => {
      expect(screen.getByText('Bishan')).toBeInTheDocument();
      expect(screen.getByText('Ang Mo Kio')).toBeInTheDocument();
    });
  });

  test('handles add button click and shows delete button', async () => {
    get2hrAirtable.mockResolvedValue([]);
    saveAreaName.mockResolvedValue();

    const mockWeatherData = {
      data: {
        items: [{ timestamp: '2024-08-08T10:00:00Z', forecasts: [] }],
        area_metadata: [{ name: 'Bishan', label_location: { latitude: 1.35, longitude: 103.85 } }],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    render(<Weather2hrs />);

    await waitFor(() => {
      const addButton = screen.getByText('Add');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import SortingOptions from '../sorting-options/sorting-options';
import { offersReducer } from '../../store/offers-slice';

// Мокаем SORTING_LABELS чтобы избежать импорта реальных данных
vi.mock('@/utils/sorting', () => ({
  SORTING_LABELS: {
    popular: 'Popular',
    'price-low-to-high': 'Price: low to high',
    'price-high-to-low': 'Price: high to low',
    'top-rated-first': 'Top rated first',
  },
}));

const createTestStore = (initialSorting: SortingType = 'popular') =>
  configureStore({
    reducer: {
      offers: offersReducer,
    },
    preloadedState: {
      offers: {
        cityTab: 'Paris',
        offers: [],
        sorting: initialSorting,
        isLoading: false,
        error: null,
      },
    },
  });

describe('SortingOptions component', () => {
  it('should display current sorting type', () => {
    const store = createTestStore('popular');
    render(
      <Provider store={store}>
        <SortingOptions />
      </Provider>
    );

    expect(screen.getByText('Sort by')).toBeInTheDocument();
    const popularElements = screen.getAllByText('Popular');
    expect(popularElements.length).toBeGreaterThan(0);
  });

  it('should have correct CSS classes', () => {
    const store = createTestStore();
    const { container } = render(
      <Provider store={store}>
        <SortingOptions />
      </Provider>
    );

    expect(container.querySelector('.places__sorting')).toBeInTheDocument();
    expect(
      container.querySelector('.places__sorting-caption')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.places__sorting-type')
    ).toBeInTheDocument();
    expect(container.querySelector('.places__options')).toBeInTheDocument();
  });

  it('should display all sorting options', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <SortingOptions />
      </Provider>
    );

    // Check that both current selection and options contain these texts
    expect(screen.getAllByText('Popular').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Price: low to high').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Price: high to low').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Top rated first').length).toBeGreaterThan(0);
  });

  it('should show active sorting option', () => {
    const store = createTestStore('price-low-to-high');
    const { container } = render(
      <Provider store={store}>
        <SortingOptions />
      </Provider>
    );

    const activeOption = container.querySelector('.places__option--active');
    expect(activeOption).toBeInTheDocument();
    expect(activeOption?.textContent).toBe('Price: low to high');
  });

  it('should have correct options list structure', () => {
    const store = createTestStore();
    const { container } = render(
      <Provider store={store}>
        <SortingOptions />
      </Provider>
    );

    const optionsList = container.querySelector('.places__options');
    expect(optionsList).toBeInTheDocument();

    const options = container.querySelectorAll('.places__option');
    expect(options).toHaveLength(4);
  });
});

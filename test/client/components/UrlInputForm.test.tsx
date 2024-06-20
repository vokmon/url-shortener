import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UrlInputForm from "~/app/_components/organisms/UrlInputForm";
import userEvent from '@testing-library/user-event'
import { api } from '~/trpc/react'; // Assuming this is mocked in your test setup


vi.mock('~/trpc/react', () => ({
  api: {
    urlShortener: {
      create: {
        useMutation: vi.fn().mockReturnValue({
          mutateAsync: vi.fn(),
          isLoading: false,
        }),
      },
    },
  },
}));

describe("Test organisms components", () => {

  beforeEach(() => {
    api.urlShortener.create.useMutation.mockReset();
  });

  it("should be able to add a new url", async () => {
    /* Mock api */
    const url = 'http://www.google.com';
    const shortUrl = 'abc123';

    const mutateAsyncMock = vi.fn().mockResolvedValueOnce({ shortUrl, fullUrl: url, counts: 0, createdAt: new Date(), updatedAt: new Date()});

    api.urlShortener.create.useMutation = vi.fn().mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isLoading: false,
    });

    // Render the component
    render(
      <UrlInputForm />,
    );
    // screen.debug(); // prints out the jsx in the App component unto the command line


    // Assert render
    expect(
      screen.getByText("Url")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Shrink")
    ).toBeInTheDocument();

    const urlInput = screen.getByTestId("url-input");
    expect(
      urlInput
    ).toBeInTheDocument();
    
    // Actions 
    // The user input url
    await userEvent.type(urlInput, url)
    expect(urlInput).toHaveValue(url) 
    const submitButton = screen.getByTestId("submit-button");

    // The user click the submit button
    expect(
      submitButton
    ).toBeInTheDocument();
    await userEvent.click(submitButton);

    // Assert the result
    expect(api.urlShortener.create.useMutation).toBeCalled();
    expect(mutateAsyncMock).toBeCalled();
    // screen.debug();
    expect(screen.getByText(`The url ${url} is successfully added.`)).toBeInTheDocument();
    expect(screen.getByText(`/${shortUrl}`)).toBeInTheDocument();
  });

  it("should throw an error when an saving error", async () => {
    /* Mock api */
    const url = 'http://www.google.com';

    const mutateAsyncMock = vi.fn().mockRejectedValueOnce({});

    api.urlShortener.create.useMutation = vi.fn().mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isLoading: false,
    });

    // Render the component
    render(
      <UrlInputForm />,
    );

    const urlInput = screen.getByTestId("url-input");
    expect(
      urlInput
    ).toBeInTheDocument();
    
    // Actions 
    // The user input url
    await userEvent.type(urlInput, url)
    expect(urlInput).toHaveValue(url) 
    const submitButton = screen.getByTestId("submit-button");

    // The user click the submit button
    expect(
      submitButton
    ).toBeInTheDocument();
    await userEvent.click(submitButton);

    // Assert the result
    expect(api.urlShortener.create.useMutation).toBeCalled();
    expect(mutateAsyncMock).toBeCalled();
    // screen.debug();
    expect(screen.getByText(`Failed to shorten the url ${url}.`)).toBeInTheDocument();
  });

  it("should not be able to submit when input invalid url", async () => {
    /* Mock api */
    const url = 'google-com';

    const mutateAsyncMock = vi.fn().mockResolvedValueOnce({})

    api.urlShortener.create.useMutation = vi.fn().mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isLoading: false,
    });

    // Render the component
    render(
      <UrlInputForm />,
    );

    const urlInput = screen.getByTestId("url-input");
    expect(
      urlInput
    ).toBeInTheDocument();
    
    // Actions 
    // The user input url
    await userEvent.type(urlInput, url)
    expect(urlInput).toHaveValue(url) 
    const submitButton = screen.getByTestId("submit-button");

    // The user click the submit button
    expect(
      submitButton
    ).toBeInTheDocument();
    await userEvent.click(submitButton);

    // Assert the result
    // The mutate function should not be called.
    expect(api.urlShortener.create.useMutation).toBeCalled();
    expect(mutateAsyncMock).toBeCalledTimes(0);
    // screen.debug();
  });
});

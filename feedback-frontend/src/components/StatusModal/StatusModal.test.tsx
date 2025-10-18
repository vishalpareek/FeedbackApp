import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StatusModal from './StatusModal';

describe('StatusModal accessibility', () => {
    test('focuses on OK button when modal opens', async () => {
        render(<StatusModal show={true} message="Test Modal" type="success" onClose={jest.fn()} />);

        const okButton = await screen.findByRole('button', { name: /close dialog/i });
        await waitFor(() => expect(okButton).toHaveFocus());
    });

    test('modal closes when OK button is clicked', async () => {
        const ModalWrapper = () => {
            const [show, setShow] = React.useState(true);
            return (
                <StatusModal
                    show={show}
                    message="Test Modal"
                    type="success"
                    onClose={() => setShow(false)}
                >
                    <p>Extra content</p>
                </StatusModal>
            );
        };

        render(<ModalWrapper />);
        const okButton = await screen.findByRole('button', { name: /close dialog/i });
        fireEvent.click(okButton);

        await waitFor(() => {
            expect(screen.queryByText(/test modal/i)).not.toBeInTheDocument();
        });
    });
});

import React from 'react';
import Button from 'components/ui/Buttons';

const BaseNavigator = props =>
{
    const { navOptions } = props;
    return (
        <>
        {
            navOptions.map((e,i) =>
            {
                return <Button
                    type="button"
                    variant="solid"
                >
                    {e.name}
                </Button>
            })
        }
		</>
	);
}

export default BaseNavigator;
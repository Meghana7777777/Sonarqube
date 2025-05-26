import React from 'react';

interface DonutChartProps {
    storagePercentage: number;
}

const IconSlider: React.FC<DonutChartProps> = ({storagePercentage}) => {
    const max = 100;
    const min = 0;
    const value = storagePercentage;

    const greenRange = 75;
    const color1 = '#1890ff';
    const color2 = '#fadb14';
    const color3 = '#ff4d4f';
    const color4 = '#52c41a';

    // Calculate the final color based on the value
    let backgroundColor = color1;
    if (value > greenRange) {
        backgroundColor = color4;
    } else if (value > 50) {
        backgroundColor = color3;
    } else if (value > 25) {
        backgroundColor = color2;
    }

    return (
        <div className="icon-wrapper">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                style={{
                    width: '100%',
                    height: '8px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    appearance: 'none',
                    outline: 'none',
                    background: `linear-gradient(to right, ${backgroundColor} 0%, ${backgroundColor} ${value}%, #d3d3d3 ${value}%, #d3d3d3 100%)`,
                }}
                readOnly
            />
            <style>
                {`
                                 input[type="range"] {
                                    &::-webkit-slider-thumb {
                                      -webkit-appearance: none;
                                      width: 0;
                                      height: 0;
                                      border: none;
                                      background: transparent;
                                    }
                        
                                    &::-moz-range-thumb {
                                      width: 0;
                                      height: 0;
                                      border: none;
                                      background: transparent;
                                    }
                        
                                    &::-ms-thumb {
                                      width: 0;
                                      height: 0;
                                      border: none;
                                      background: transparent;
                                    }
                                  }
                               `}
            </style>
        </div>
    );
};

export default IconSlider;

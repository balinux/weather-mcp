import { getWeather } from './src/tools/weather';

// Test the weather function
async function testWeather() {
    try {
        console.log('Testing weather function...');
        const result = await getWeather({ city: 'Jakarta' });
        console.log('Weather result:', result);
        
        // Test with another city
        const result2 = await getWeather({ city: 'London' });
        console.log('Weather result for London:', result2);
    } catch (error) {
        console.error('Error testing weather function:', error);
    }
}

testWeather();
require.config({
    paths: {
        'jquery': ['https://code.jquery.com/jquery-2.1.3.min', '../../components/jquery/dist/jquery.min'],
        'foundation':'../../components/foundation/js/foundation.min'
    }
});

requirejs(['app']); // Load the 'app' module
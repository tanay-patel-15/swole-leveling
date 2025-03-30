from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import os
import pickle
import warnings
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import mean_absolute_error

warnings.filterwarnings('ignore')
app = Flask(__name__)

# Generate synthetic data for multiple exercise types
np.random.seed(42)
n_samples = 3000  # Increased samples

# Define more exercises with realistic parameters
exercise_data = {
    'deadlift': {
        'base_weight': 140,
        'specificity': 1.2,
        'progression_rate': 5.0,
        'category': 'compound_lower'
    },
    'bench_press': {
        'base_weight': 80,
        'specificity': 1.0,
        'progression_rate': 2.5,
        'category': 'compound_upper'
    },
    'squat': {
        'base_weight': 120,
        'specificity': 1.15,
        'progression_rate': 5.0,
        'category': 'compound_lower'
    },
    'overhead_press': {
        'base_weight': 50,
        'specificity': 0.9,
        'progression_rate': 2.0,
        'category': 'compound_upper'
    },
    'barbell_row': {
        'base_weight': 70,
        'specificity': 0.95,
        'progression_rate': 2.5,
        'category': 'compound_upper'
    },
    'bicep_curl': {
        'base_weight': 20,
        'specificity': 0.8,
        'progression_rate': 1.0,
        'category': 'isolation_upper'
    },
    'tricep_extension': {
        'base_weight': 25,
        'specificity': 0.8,
        'progression_rate': 1.0,
        'category': 'isolation_upper'
    },
    'leg_press': {
        'base_weight': 150,
        'specificity': 1.1,
        'progression_rate': 10.0,
        'category': 'compound_lower'
    },
    'romanian_deadlift': {
        'base_weight': 100,
        'specificity': 1.1,
        'progression_rate': 4.0,
        'category': 'compound_lower'
    },
    'front_squat': {
        'base_weight': 90,
        'specificity': 1.1,
        'progression_rate': 4.0,
        'category': 'compound_lower'
    },
    'incline_bench': {
        'base_weight': 65,
        'specificity': 0.95,
        'progression_rate': 2.0,
        'category': 'compound_upper'
    },
    'pull_ups': {
        'base_weight': 0,  # Bodyweight exercise
        'specificity': 1.0,
        'progression_rate': 1.0,
        'category': 'compound_upper'
    },
    'dips': {
        'base_weight': 0,  # Bodyweight exercise
        'specificity': 1.0,
        'progression_rate': 1.0,
        'category': 'compound_upper'
    },
    'lateral_raise': {
        'base_weight': 10,
        'specificity': 0.7,
        'progression_rate': 0.5,
        'category': 'isolation_upper'
    },
    'face_pull': {
        'base_weight': 15,
        'specificity': 0.7,
        'progression_rate': 1.0,
        'category': 'isolation_upper'
    },
    'calf_raise': {
        'base_weight': 100,
        'specificity': 0.8,
        'progression_rate': 5.0,
        'category': 'isolation_lower'
    },
    'leg_extension': {
        'base_weight': 50,
        'specificity': 0.8,
        'progression_rate': 2.5,
        'category': 'isolation_lower'
    },
    'leg_curl': {
        'base_weight': 45,
        'specificity': 0.8,
        'progression_rate': 2.5,
        'category': 'isolation_lower'
    }
}

# Generate more varied data
data = {
    'sets': np.random.randint(2, 8, n_samples),
    'reps': np.random.randint(3, 20, n_samples),
    'workout_type': np.random.choice(list(exercise_data.keys()), n_samples),
    'weight': np.zeros(n_samples),
    'experience_level': np.random.choice(['beginner', 'intermediate', 'advanced'], n_samples, p=[0.3, 0.5, 0.2]),  # Adjusted distribution
    'previous_success': np.random.choice([0, 1], n_samples, p=[0.2, 0.8])
}

# Enhanced weight calculation with more realistic relationships
for i in range(n_samples):
    exercise = data['workout_type'][i]
    exercise_info = exercise_data[exercise]
    base = exercise_info['base_weight']
    sets = data['sets'][i]
    reps = data['reps'][i]
    
    # Experience level modifier with more granular progression
    experience_mod = {
        'beginner': 0.7,
        'intermediate': 1.0,
        'advanced': 1.4  # Increased difference for advanced
    }[data['experience_level'][i]]
    
    # More sophisticated weight calculation
    intensity_factor = 1.1 - (reps * 0.025)  # Reduced rep penalty
    volume_factor = 1 + (sets * 0.015)       # Reduced set bonus
    fatigue_factor = np.exp(-sets * 0.08)    # Adjusted fatigue curve
    success_bonus = 1 + (0.07 * data['previous_success'][i])  # Increased success bonus
    
    # Calculate weight with all factors
    calculated_weight = (
        base 
        * intensity_factor 
        * volume_factor 
        * fatigue_factor 
        * exercise_info['specificity']
        * experience_mod
        * success_bonus
    )
    
    # Add some random variation (reduced for more stability)
    variation = np.random.normal(0, base * 0.02)  # Reduced variation
    data['weight'][i] = max(5, calculated_weight + variation)

# Create DataFrame and add engineered features
df = pd.DataFrame(data)
df['volume'] = df['sets'] * df['reps']
df['intensity_score'] = 1.1 - (df['reps'] * 0.025)
df['fatigue_score'] = np.exp(-df['sets'] * 0.08)
df['exercise_category'] = df['workout_type'].map(lambda x: exercise_data[x]['category'])
df['base_progression_rate'] = df['workout_type'].map(lambda x: exercise_data[x]['progression_rate'])
df['total_load'] = df['weight'] * df['volume']  # New feature
df['avg_rep_weight'] = df['weight'] / df['reps']  # New feature

# Select features for model
X = df[[
    'sets', 'reps', 'workout_type', 'volume', 'intensity_score', 
    'fatigue_score', 'exercise_category', 'experience_level',
    'previous_success', 'base_progression_rate', 'total_load', 'avg_rep_weight'
]]
y = df['weight']

# Split data with larger training set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

# Create preprocessing steps
numeric_features = ['sets', 'reps', 'volume', 'intensity_score', 'fatigue_score', 
                   'base_progression_rate', 'total_load', 'avg_rep_weight']
categorical_features = ['workout_type', 'exercise_category', 'experience_level']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(drop='first', sparse_output=False), categorical_features)
    ])

# Create improved ensemble models
rf = RandomForestRegressor(
    n_estimators=400,  # Increased trees
    max_depth=15,      # Increased depth
    min_samples_leaf=2,
    max_features='sqrt',
    random_state=42
)

gb = GradientBoostingRegressor(
    n_estimators=300,   # Increased trees
    learning_rate=0.05, # Reduced learning rate
    max_depth=8,
    subsample=0.8,      # Added subsampling
    random_state=42
)

# Create voting ensemble with weights
ensemble = VotingRegressor([
    ('rf', rf),
    ('gb', gb)
], weights=[0.6, 0.4])  # Weight RF more as it's typically more stable

# Create pipeline
model = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', ensemble)
])

# Train and evaluate with cross-validation
cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='neg_mean_absolute_error')
print(f"Cross-validation MAE: {-cv_scores.mean():.2f} kg ± {cv_scores.std():.2f} kg")

# Final training and evaluation
model.fit(X_train, y_train)
preds = model.predict(X_test)
print(f"Test set MAE: {mean_absolute_error(y_test, preds):.2f} kg")

with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

class WorkoutTracker:
    def __init__(self, model, min_samples_retrain=10):
        self.model = model
        self.min_samples_retrain = min_samples_retrain
        self.new_training_data = []
        
    def log_workout(self, exercise_type, sets, reps, actual_weight, 
                   experience_level='intermediate', previous_success=True):
        """Log a completed workout with actual weight used"""
        # Calculate features using the same formulas as training data
        volume = sets * reps
        intensity_score = 1.1 - (reps * 0.025)  # Match training data formula
        fatigue_score = np.exp(-sets * 0.08)    # Match training data formula
        total_load = actual_weight * volume
        avg_rep_weight = actual_weight / reps
        
        workout_data = {
            'sets': sets,
            'reps': reps,
            'workout_type': exercise_type,
            'volume': volume,
            'intensity_score': intensity_score,
            'fatigue_score': fatigue_score,
            'exercise_category': exercise_data[exercise_type]['category'],
            'experience_level': experience_level,
            'previous_success': 1 if previous_success else 0,
            'base_progression_rate': exercise_data[exercise_type]['progression_rate'],
            'total_load': total_load,
            'avg_rep_weight': avg_rep_weight,
            'weight': actual_weight
        }
        self.new_training_data.append(workout_data)
        print(f"Logged workout: {exercise_type} - {sets}x{reps} @ {actual_weight}kg")
        
        # Check if we should retrain
        if len(self.new_training_data) >= self.min_samples_retrain:
            self.retrain_model()
    
    def retrain_model(self):
        """Retrain the model with new data"""
        if not self.new_training_data:
            return
        
        # Convert new data to DataFrame
        new_data_df = pd.DataFrame(self.new_training_data)
        
        # Combine with existing training data
        X_new = pd.concat([
            X_train, 
            new_data_df[[
                'sets', 'reps', 'workout_type', 'volume', 'intensity_score',
                'fatigue_score', 'exercise_category', 'experience_level',
                'previous_success', 'base_progression_rate', 'total_load', 'avg_rep_weight'
            ]]
        ])
        y_new = pd.concat([pd.Series(y_train), new_data_df['weight']])
        
        # Retrain model
        print("\nRetraining model with new data...")
        self.model.fit(X_new, y_new)
        
        # Clear the new training data buffer
        self.new_training_data = []
        print("Model retrained successfully!")
        
        # Evaluate new model performance
        preds_new = self.model.predict(X_test)
        new_mae = mean_absolute_error(y_test, preds_new)
        print(f"Updated model MAE: {new_mae:.2f} kg")

# Initialize workout tracker
tracker = WorkoutTracker(model)

# Example of real-time usage with more realistic data
print("\nSimulating real workout sessions...")
example_workouts = [
    {
        'exercise': 'bench_press',
        'sets': 5,
        'reps': 5,
        'weight': 85.0,
        'experience_level': 'intermediate',
        'previous_success': True
    },
    {
        'exercise': 'deadlift',
        'sets': 4,
        'reps': 6,
        'weight': 150.0,
        'experience_level': 'advanced',
        'previous_success': True
    },
    {
        'exercise': 'squat',
        'sets': 5,
        'reps': 5,
        'weight': 120.0,
        'experience_level': 'intermediate',
        'previous_success': True
    },
    {
        'exercise': 'overhead_press',
        'sets': 4,
        'reps': 8,
        'weight': 45.0,
        'experience_level': 'beginner',
        'previous_success': False
    },
    {
        'exercise': 'bicep_curl',
        'sets': 3,
        'reps': 12,
        'weight': 22.5,
        'experience_level': 'intermediate',
        'previous_success': True
    },
    {
        'exercise': 'barbell_row',
        'sets': 4,
        'reps': 8,
        'weight': 70.0,
        'experience_level': 'intermediate',
        'previous_success': True
    },
    {
        'exercise': 'leg_press',
        'sets': 3,
        'reps': 15,
        'weight': 140.0,
        'experience_level': 'beginner',
        'previous_success': True
    },
    {
        'exercise': 'tricep_extension',
        'sets': 3,
        'reps': 12,
        'weight': 25.0,
        'experience_level': 'intermediate',
        'previous_success': True
    }
]

for workout in example_workouts:
    tracker.log_workout(
        exercise_type=workout['exercise'],
        sets=workout['sets'],
        reps=workout['reps'],
        actual_weight=workout['weight'],
        experience_level=workout['experience_level'],
        previous_success=workout['previous_success']
    )
# Force retrain with any remaining data
tracker.retrain_model()  # Added this line to force retraining after all logs

def recommend_workout(goal, user_strength_level='intermediate', previous_success=True):
    """Recommend workout parameters based on user's goal and strength level"""
    base_recommendations = {
        'strength': {
            'deadlift': {'sets': 5, 'reps': 5},
            'squat': {'sets': 5, 'reps': 5},
            'bench_press': {'sets': 5, 'reps': 5},
            'overhead_press': {'sets': 5, 'reps': 5}
        },
        'hypertrophy': {
            'bench_press': {'sets': 4, 'reps': 8},
            'barbell_row': {'sets': 4, 'reps': 8},
            'tricep_extension': {'sets': 3, 'reps': 12},
            'bicep_curl': {'sets': 3, 'reps': 12}
        },
        'endurance': {
            'leg_press': {'sets': 3, 'reps': 15},
            'bench_press': {'sets': 3, 'reps': 15},
            'barbell_row': {'sets': 3, 'reps': 15}
        }
    }
    
    recommendations = {}
    for exercise, params in base_recommendations[goal].items():
        # First, make an initial prediction without total_load and avg_rep_weight
        initial_df = pd.DataFrame([[
            params['sets'],
            params['reps'],
            exercise,
            params['sets'] * params['reps'],  # volume
            1.1 - (params['reps'] * 0.025),   # intensity_score - match training formula
            np.exp(-params['sets'] * 0.08),   # fatigue_score - match training formula
            exercise_data[exercise]['category'],
            user_strength_level,
            1 if previous_success else 0,
            exercise_data[exercise]['progression_rate'],
            0,  # placeholder for total_load
            0   # placeholder for avg_rep_weight
        ]], columns=['sets', 'reps', 'workout_type', 'volume', 'intensity_score', 
                    'fatigue_score', 'exercise_category', 'experience_level',
                    'previous_success', 'base_progression_rate', 'total_load', 'avg_rep_weight'])
        
        # Get initial prediction
        predicted_weight = model.predict(initial_df)[0]
        
        # Now update total_load and avg_rep_weight based on predicted weight
        initial_df['total_load'] = predicted_weight * params['sets'] * params['reps']
        initial_df['avg_rep_weight'] = predicted_weight / params['reps']
        
        # Make final prediction with all features
        final_prediction = model.predict(initial_df)[0]
        
        recommendations[exercise] = {
            'sets': params['sets'],
            'reps': params['reps'],
            'predicted_weight': final_prediction
        }
    
    return recommendations

# Test different scenarios
test_cases = [
    {"goal": "strength", "user_strength_level": "beginner", "previous_success": True},
    {"goal": "strength", "user_strength_level": "advanced", "previous_success": True},
    {"goal": "hypertrophy", "user_strength_level": "intermediate", "previous_success": True},
    {"goal": "endurance", "user_strength_level": "intermediate", "previous_success": False}
]

print("\nWorkout Recommendations:")
print("------------------------")
for case in test_cases:
    print(f"\nWorkout Plan for {case['user_strength_level']} level, {case['goal']} goal:")
    recommendations = recommend_workout(**case)
    for exercise, details in recommendations.items():
        print(f"{exercise}: {details['sets']}x{details['reps']} @ {details['predicted_weight']:.1f}kg")

@app.route('/train', methods=['GET'])
def train():
    """
    (Re)train the model using the synthetic data.
    In this example the training is done when the server starts.
    Calling this endpoint retrains the model and updates the pickle file.
    """
    try:
        global model, X_train, y_train, X_test, y_test
        # Retrain the model
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='neg_mean_absolute_error')
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        with open('model.pkl', 'wb') as f:
            pickle.dump(model, f)
        return jsonify({
            "message": "Model retrained successfully",
            "cv_mae": f"{-cv_scores.mean():.2f} kg ± {cv_scores.std():.2f} kg",
            "test_mae": f"{mae:.2f} kg"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['GET'])
def predict():
    """
    Predict the recommended weight.
    Expects query parameters:
    - sets: int
    - reps: int
    - workout_type: str
    - experience_level: str
    - previous_success: bool (optional)
    """
    try:
        # Get parameters from query string
        sets = request.args.get('sets', type=int)
        reps = request.args.get('reps', type=int)
        workout_type = request.args.get('workout_type')
        experience_level = request.args.get('experience_level', 'intermediate')
        previous_success = request.args.get('previous_success', 'true').lower() == 'true'

        if not all([sets, reps, workout_type]):
            return jsonify({"error": "Missing required parameters: sets, reps, workout_type"}), 400

        # Calculate derived features
        volume = sets * reps
        intensity_score = 1.1 - (reps * 0.025)
        fatigue_score = np.exp(-sets * 0.08)
        
        # Create initial DataFrame for prediction
        input_data = {
            'sets': sets,
            'reps': reps,
            'workout_type': workout_type,
            'volume': volume,
            'intensity_score': intensity_score,
            'fatigue_score': fatigue_score,
            'exercise_category': exercise_data[workout_type]['category'],
            'experience_level': experience_level,
            'previous_success': 1 if previous_success else 0,
            'base_progression_rate': exercise_data[workout_type]['progression_rate'],
            'total_load': 0,  # Will be updated after initial prediction
            'avg_rep_weight': 0  # Will be updated after initial prediction
        }
        
        # First prediction
        df = pd.DataFrame([input_data])
        initial_pred = model.predict(df)[0]
        
        # Update derived features
        df['total_load'] = initial_pred * volume
        df['avg_rep_weight'] = initial_pred / reps
        
        # Final prediction
        final_pred = model.predict(df)[0]
        
        return jsonify({
            "predicted_weight": round(final_pred, 1),
            "sets": sets,
            "reps": reps
        })
        
    except KeyError as e:
        return jsonify({"error": f"Invalid workout type: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/recommend', methods=['GET'])
def recommend():
    """
    Recommend a workout plan.
    Expects query parameters:
    - goal: str ("strength", "hypertrophy", or "endurance")
    - user_strength_level: str ("beginner", "intermediate", or "advanced")
    - previous_success: bool (optional)
    """
    try:
        goal = request.args.get('goal')
        if not goal:
            return jsonify({"error": "Goal is required"}), 400
        if goal not in ["strength", "hypertrophy", "endurance"]:
            return jsonify({"error": "Invalid goal. Must be one of: strength, hypertrophy, endurance"}), 400
            
        user_strength_level = request.args.get('user_strength_level', 'intermediate')
        if user_strength_level not in ["beginner", "intermediate", "advanced"]:
            return jsonify({"error": "Invalid strength level. Must be one of: beginner, intermediate, advanced"}), 400
            
        previous_success = request.args.get('previous_success', 'true').lower() == 'true'
        
        recommendations = recommend_workout(goal, user_strength_level, previous_success)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Add a simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "model_loaded": model is not None})

if __name__ == '__main__':
    app.run(debug=True)
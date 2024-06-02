
import math
from random import randint, shuffle
import random

def solve(points):
  
    population_size = 10 
    generations = 10  
    mutation_rate = 0.1  
    
    def dist(p1, p2):
        return float(math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2))

    def create_initial_population(points, population_size):
        population = []
        for _ in range(population_size):
            solution = points.copy()
            shuffle(solution)
            solution.append(solution[0])
            population.append(solution)
        return population

    def fitness(solution, distance_matrix, point_to_index):
        total_distance = 0
        for i in range(len(solution) - 1):
            current_point = solution[i]
            next_point = solution[i + 1]
            current_point_index = point_to_index[current_point]
            next_point_index = point_to_index[next_point]
            total_distance += distance_matrix[current_point_index][next_point_index]
        return total_distance


    
    def selection(population, fitness_scores):
        selected_parents = roulette_wheel_selection_elitism(population, fitness_scores)

        return selected_parents

    def crossover(parent1, parent2):
        offspring1, offspring2 = ordered_crossover(parent1, parent2)
        return offspring1, offspring2

    def mutation(solution, mutation_rate):
        """Applies mutations to a solution with a certain probability."""
        for i in range(1, len(solution) - 1): 
            if random.random() < mutation_rate:
                j = randint(1, len(solution) - 2)  
                solution[i], solution[j] = solution[j], solution[i]

    def genetic_algorithm(points, population_size, generations, mutation_rate):
        """Main genetic algorithm loop."""

        point_to_index = {}
        index = 0
        for point in points:
            if point not in point_to_index:
                point_to_index[point] = index
                index += 1

        distance_matrix = [[dist(p1, p2) for p2 in points] for p1 in points]

        population = create_initial_population(points.copy(), population_size)
        best_solution = None
        best_fitness = float('inf')  

        for generation in range(generations):
            fitness_scores = [fitness(solution, distance_matrix, point_to_index) for solution in population]
            best_solution_index = fitness_scores.index(min(fitness_scores))
            best_solution = population[best_solution_index]

            selected_parents = selection(population, fitness_scores)
            
            offspring = []
            for i in range(0, len(selected_parents), 2):
                parent1, parent2 = selected_parents[i], selected_parents[i + 1]
                offspring1, offspring2 = crossover(parent1, parent2)
                mutation(offspring1, mutation_rate)
                mutation(offspring2, mutation_rate)
                offspring.extend([offspring1, offspring2])
            population = offspring

        return best_solution


    best_solution = genetic_algorithm(points.copy(), population_size, generations, mutation_rate)
    return best_solution[:-1]  

def roulette_wheel_selection_elitism(population, fitness_scores, elite_size=2):
   
    total_fitness = sum(fitness_scores)
    probabilities = [score / total_fitness for score in fitness_scores]

    elite_indices = sorted(range(len(population)), key=lambda i: fitness_scores[i])[:elite_size]
    elite_parents = [population[i] for i in elite_indices]

    selected_parents = elite_parents.copy()
    for _ in range(len(population) // 2 - elite_size):
        selection_point = random.uniform(0, total_fitness)
        current_fitness = 0
        for i, probability in enumerate(probabilities):
            current_fitness += probability
            if current_fitness >= selection_point:
                selected_parents.append(population[i])
                break
    return selected_parents


def ordered_crossover(parent1, parent2):
   
    crossover_point1, crossover_point2 = sorted(random.sample(range(1, len(parent1) - 1), 2))
    seen_genes = set(parent1[crossover_point1:crossover_point2])
    offspring1 = parent1[crossover_point1:crossover_point2] + [gene for gene in parent2 if gene not in seen_genes]
    offspring2 = parent2[crossover_point1:crossover_point2] + [gene for gene in parent1 if gene not in seen_genes]
    return offspring1, offspring2


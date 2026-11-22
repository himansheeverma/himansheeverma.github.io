#include <stdio.h>

/* 1. Right-angled triangle
 *
 *  *
 *  * *
 *  * * *
 */
void right_triangle(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++)
            printf("* ");
        printf("\n");
    }
}

/* 2. Inverted right-angled triangle */
void inverted_triangle(int n) {
    for (int i = n; i >= 1; i--) {
        for (int j = 1; j <= i; j++)
            printf("* ");
        printf("\n");
    }
}

/* 3. Pyramid */
void pyramid(int n) {
    for (int i = 1; i <= n; i++) {
        for (int s = 1; s <= n - i; s++)
            printf(" ");
        for (int j = 1; j <= i; j++)
            printf("* ");
        printf("\n");
    }
}

/* 4. Diamond */
void diamond(int n) {
    pyramid(n);
    for (int i = n - 1; i >= 1; i--) {
        for (int s = 1; s <= n - i; s++)
            printf(" ");
        for (int j = 1; j <= i; j++)
            printf("* ");
        printf("\n");
    }
}

/* 5. Hollow square */
void hollow_square(int n) {
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i == 1 || i == n || j == 1 || j == n)
                printf("* ");
            else
                printf("  ");
        }
        printf("\n");
    }
}

int main(void) {
    int n;

    printf("Enter number of rows: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Please enter a positive integer.\n");
        return 1;
    }

    printf("\n1. Right Triangle\n");
    right_triangle(n);

    printf("\n2. Inverted Triangle\n");
    inverted_triangle(n);

    printf("\n3. Pyramid\n");
    pyramid(n);

    printf("\n4. Diamond\n");
    diamond(n);

    printf("\n5. Hollow Square\n");
    hollow_square(n);

    return 0;
}

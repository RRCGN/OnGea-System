<?php

/* themes/contrib/ongea_theme/templates/layout/page.html.twig */
class __TwigTemplate_913afa771a244ed3309d9518d9dc7a5eb9e7141f8902aa2bb87f0f8572c76818 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("include" => 1, "if" => 12);
        $filters = array();
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('include', 'if'),
                array(),
                array()
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        $this->loadTemplate("@ongea_theme/temporary/assets.html.twig", "themes/contrib/ongea_theme/templates/layout/page.html.twig", 1)->display($context);
        // line 2
        echo "
<div class=\"layout-container\">

  ";
        // line 6
        echo "  ";
        $this->loadTemplate("@ongea_theme/components/header-component.html.twig", "themes/contrib/ongea_theme/templates/layout/page.html.twig", 6)->display($context);
        // line 7
        echo "
  ";
        // line 9
        echo "  ";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", array()), "breadcrumbs", array()), "html", null, true));
        echo "
  <main role=\"main\">
    <a id=\"main-content\" tabindex=\"-1\"></a>
    ";
        // line 12
        if ($this->getAttribute(($context["page"] ?? null), "content", array())) {
            // line 13
            echo "      <div class=\"layout-content\">
        ";
            // line 14
            if (($context["no_container"] ?? null)) {
                // line 15
                echo "          ";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "content", array()), "html", null, true));
                echo "
        ";
            } else {
                // line 17
                echo "          ";
                if (($context["is_front"] ?? null)) {
                    // line 18
                    echo "            ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "content", array()), "html", null, true));
                    echo "
          ";
                } else {
                    // line 20
                    echo "            <div class=\"container\">
              ";
                    // line 21
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "content", array()), "html", null, true));
                    echo "
            </div>
          ";
                }
                // line 24
                echo "        ";
            }
            // line 25
            echo "      </div>
    ";
        }
        // line 27
        echo "  </main>

  ";
        // line 30
        echo "  ";
        if ($this->getAttribute(($context["page"] ?? null), "footer", array())) {
            // line 31
            echo "    <footer class=\"footer\" role=\"contentinfo\">
      ";
            // line 32
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["page"] ?? null), "footer", array()), "html", null, true));
            echo "
    </footer>
  ";
        }
        // line 35
        echo "
</div>

";
    }

    public function getTemplateName()
    {
        return "themes/contrib/ongea_theme/templates/layout/page.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  117 => 35,  111 => 32,  108 => 31,  105 => 30,  101 => 27,  97 => 25,  94 => 24,  88 => 21,  85 => 20,  79 => 18,  76 => 17,  70 => 15,  68 => 14,  65 => 13,  63 => 12,  56 => 9,  53 => 7,  50 => 6,  45 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "themes/contrib/ongea_theme/templates/layout/page.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/layout/page.html.twig");
    }
}

//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_activity_input_proof.g.dart';

/// ProgressionActivityInputProof
///
/// Properties:
/// * [articleId]
/// * [completed]
/// * [items]
@BuiltValue()
abstract class ProgressionActivityInputProof implements Built<ProgressionActivityInputProof, ProgressionActivityInputProofBuilder> {
  @BuiltValueField(wireName: r'articleId')
  ProgressionActivityInputProofArticleIdEnum? get articleId;
  // enum articleIdEnum {  how-ai-works,  feature-map,  reading-analysis,  validity-confidence,  adaptive-plan,  analysis-workflow,  bias-confidence-validity,  levels-chart,  technical-fundamental,  standard-plan,  adaptive-position-plan,  account-rules,  terms,  };

  @BuiltValueField(wireName: r'completed')
  bool? get completed;

  @BuiltValueField(wireName: r'items')
  BuiltList<ProgressionActivityInputProofItemsEnum>? get items;
  // enum itemsEnum {  risk_acknowledged,  invalidation_reviewed,  timeframe_checked,  no_revenge_trade,  };

  ProgressionActivityInputProof._();

  factory ProgressionActivityInputProof([void updates(ProgressionActivityInputProofBuilder b)]) = _$ProgressionActivityInputProof;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionActivityInputProofBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionActivityInputProof> get serializer => _$ProgressionActivityInputProofSerializer();
}

class _$ProgressionActivityInputProofSerializer implements PrimitiveSerializer<ProgressionActivityInputProof> {
  @override
  final Iterable<Type> types = const [ProgressionActivityInputProof, _$ProgressionActivityInputProof];

  @override
  final String wireName = r'ProgressionActivityInputProof';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionActivityInputProof object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.articleId != null) {
      yield r'articleId';
      yield serializers.serialize(
        object.articleId,
        specifiedType: const FullType(ProgressionActivityInputProofArticleIdEnum),
      );
    }
    if (object.completed != null) {
      yield r'completed';
      yield serializers.serialize(
        object.completed,
        specifiedType: const FullType(bool),
      );
    }
    if (object.items != null) {
      yield r'items';
      yield serializers.serialize(
        object.items,
        specifiedType: const FullType(BuiltList, [FullType(ProgressionActivityInputProofItemsEnum)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionActivityInputProof object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionActivityInputProofBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'articleId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(ProgressionActivityInputProofArticleIdEnum),
          ) as ProgressionActivityInputProofArticleIdEnum?;
          if (valueDes == null) continue;
          result.articleId = valueDes;
          break;
        case r'completed':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.completed = valueDes;
          break;
        case r'items':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(ProgressionActivityInputProofItemsEnum)]),
          ) as BuiltList<ProgressionActivityInputProofItemsEnum>?;
          if (valueDes == null) continue;
          result.items.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionActivityInputProof deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionActivityInputProofBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class ProgressionActivityInputProofArticleIdEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'how-ai-works')
  static const ProgressionActivityInputProofArticleIdEnum howAiWorks = _$progressionActivityInputProofArticleIdEnum_howAiWorks;
  @BuiltValueEnumConst(wireName: r'feature-map')
  static const ProgressionActivityInputProofArticleIdEnum featureMap = _$progressionActivityInputProofArticleIdEnum_featureMap;
  @BuiltValueEnumConst(wireName: r'reading-analysis')
  static const ProgressionActivityInputProofArticleIdEnum readingAnalysis = _$progressionActivityInputProofArticleIdEnum_readingAnalysis;
  @BuiltValueEnumConst(wireName: r'validity-confidence')
  static const ProgressionActivityInputProofArticleIdEnum validityConfidence = _$progressionActivityInputProofArticleIdEnum_validityConfidence;
  @BuiltValueEnumConst(wireName: r'adaptive-plan')
  static const ProgressionActivityInputProofArticleIdEnum adaptivePlan = _$progressionActivityInputProofArticleIdEnum_adaptivePlan;
  @BuiltValueEnumConst(wireName: r'analysis-workflow')
  static const ProgressionActivityInputProofArticleIdEnum analysisWorkflow = _$progressionActivityInputProofArticleIdEnum_analysisWorkflow;
  @BuiltValueEnumConst(wireName: r'bias-confidence-validity')
  static const ProgressionActivityInputProofArticleIdEnum biasConfidenceValidity = _$progressionActivityInputProofArticleIdEnum_biasConfidenceValidity;
  @BuiltValueEnumConst(wireName: r'levels-chart')
  static const ProgressionActivityInputProofArticleIdEnum levelsChart = _$progressionActivityInputProofArticleIdEnum_levelsChart;
  @BuiltValueEnumConst(wireName: r'technical-fundamental')
  static const ProgressionActivityInputProofArticleIdEnum technicalFundamental = _$progressionActivityInputProofArticleIdEnum_technicalFundamental;
  @BuiltValueEnumConst(wireName: r'standard-plan')
  static const ProgressionActivityInputProofArticleIdEnum standardPlan = _$progressionActivityInputProofArticleIdEnum_standardPlan;
  @BuiltValueEnumConst(wireName: r'adaptive-position-plan')
  static const ProgressionActivityInputProofArticleIdEnum adaptivePositionPlan = _$progressionActivityInputProofArticleIdEnum_adaptivePositionPlan;
  @BuiltValueEnumConst(wireName: r'account-rules')
  static const ProgressionActivityInputProofArticleIdEnum accountRules = _$progressionActivityInputProofArticleIdEnum_accountRules;
  @BuiltValueEnumConst(wireName: r'terms')
  static const ProgressionActivityInputProofArticleIdEnum terms = _$progressionActivityInputProofArticleIdEnum_terms;

  static Serializer<ProgressionActivityInputProofArticleIdEnum> get serializer => _$progressionActivityInputProofArticleIdEnumSerializer;

  const ProgressionActivityInputProofArticleIdEnum._(String name): super(name);

  static BuiltSet<ProgressionActivityInputProofArticleIdEnum> get values => _$progressionActivityInputProofArticleIdEnumValues;
  static ProgressionActivityInputProofArticleIdEnum valueOf(String name) => _$progressionActivityInputProofArticleIdEnumValueOf(name);
}

class ProgressionActivityInputProofItemsEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'risk_acknowledged')
  static const ProgressionActivityInputProofItemsEnum riskAcknowledged = _$progressionActivityInputProofItemsEnum_riskAcknowledged;
  @BuiltValueEnumConst(wireName: r'invalidation_reviewed')
  static const ProgressionActivityInputProofItemsEnum invalidationReviewed = _$progressionActivityInputProofItemsEnum_invalidationReviewed;
  @BuiltValueEnumConst(wireName: r'timeframe_checked')
  static const ProgressionActivityInputProofItemsEnum timeframeChecked = _$progressionActivityInputProofItemsEnum_timeframeChecked;
  @BuiltValueEnumConst(wireName: r'no_revenge_trade')
  static const ProgressionActivityInputProofItemsEnum noRevengeTrade = _$progressionActivityInputProofItemsEnum_noRevengeTrade;

  static Serializer<ProgressionActivityInputProofItemsEnum> get serializer => _$progressionActivityInputProofItemsEnumSerializer;

  const ProgressionActivityInputProofItemsEnum._(String name): super(name);

  static BuiltSet<ProgressionActivityInputProofItemsEnum> get values => _$progressionActivityInputProofItemsEnumValues;
  static ProgressionActivityInputProofItemsEnum valueOf(String name) => _$progressionActivityInputProofItemsEnumValueOf(name);
}


//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'feedback.g.dart';

/// Feedback
///
/// Properties:
/// * [id] 
/// * [analysisId] 
/// * [feedbackType] 
/// * [outcome] 
/// * [note] 
/// * [createdAt] 
@BuiltValue()
abstract class Feedback implements Built<Feedback, FeedbackBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'analysisId')
  int get analysisId;

  @BuiltValueField(wireName: r'feedbackType')
  FeedbackFeedbackTypeEnum get feedbackType;
  // enum feedbackTypeEnum {  useful,  not_useful,  };

  @BuiltValueField(wireName: r'outcome')
  FeedbackOutcomeEnum? get outcome;
  // enum outcomeEnum {  correct,  wrong,  unknown,  };

  @BuiltValueField(wireName: r'note')
  String? get note;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  Feedback._();

  factory Feedback([void updates(FeedbackBuilder b)]) = _$Feedback;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FeedbackBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<Feedback> get serializer => _$FeedbackSerializer();
}

class _$FeedbackSerializer implements PrimitiveSerializer<Feedback> {
  @override
  final Iterable<Type> types = const [Feedback, _$Feedback];

  @override
  final String wireName = r'Feedback';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    Feedback object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'analysisId';
    yield serializers.serialize(
      object.analysisId,
      specifiedType: const FullType(int),
    );
    yield r'feedbackType';
    yield serializers.serialize(
      object.feedbackType,
      specifiedType: const FullType(FeedbackFeedbackTypeEnum),
    );
    if (object.outcome != null) {
      yield r'outcome';
      yield serializers.serialize(
        object.outcome,
        specifiedType: const FullType(FeedbackOutcomeEnum),
      );
    }
    if (object.note != null) {
      yield r'note';
      yield serializers.serialize(
        object.note,
        specifiedType: const FullType(String),
      );
    }
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    Feedback object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FeedbackBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'analysisId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.analysisId = valueDes;
          break;
        case r'feedbackType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FeedbackFeedbackTypeEnum),
          ) as FeedbackFeedbackTypeEnum;
          result.feedbackType = valueDes;
          break;
        case r'outcome':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(FeedbackOutcomeEnum),
          ) as FeedbackOutcomeEnum?;
          if (valueDes == null) continue;
          result.outcome = valueDes;
          break;
        case r'note':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.note = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  Feedback deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FeedbackBuilder();
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

class FeedbackFeedbackTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'useful')
  static const FeedbackFeedbackTypeEnum useful = _$feedbackFeedbackTypeEnum_useful;
  @BuiltValueEnumConst(wireName: r'not_useful')
  static const FeedbackFeedbackTypeEnum notUseful = _$feedbackFeedbackTypeEnum_notUseful;

  static Serializer<FeedbackFeedbackTypeEnum> get serializer => _$feedbackFeedbackTypeEnumSerializer;

  const FeedbackFeedbackTypeEnum._(String name): super(name);

  static BuiltSet<FeedbackFeedbackTypeEnum> get values => _$feedbackFeedbackTypeEnumValues;
  static FeedbackFeedbackTypeEnum valueOf(String name) => _$feedbackFeedbackTypeEnumValueOf(name);
}

class FeedbackOutcomeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'correct')
  static const FeedbackOutcomeEnum correct = _$feedbackOutcomeEnum_correct;
  @BuiltValueEnumConst(wireName: r'wrong')
  static const FeedbackOutcomeEnum wrong = _$feedbackOutcomeEnum_wrong;
  @BuiltValueEnumConst(wireName: r'unknown')
  static const FeedbackOutcomeEnum unknown = _$feedbackOutcomeEnum_unknown;

  static Serializer<FeedbackOutcomeEnum> get serializer => _$feedbackOutcomeEnumSerializer;

  const FeedbackOutcomeEnum._(String name): super(name);

  static BuiltSet<FeedbackOutcomeEnum> get values => _$feedbackOutcomeEnumValues;
  static FeedbackOutcomeEnum valueOf(String name) => _$feedbackOutcomeEnumValueOf(name);
}


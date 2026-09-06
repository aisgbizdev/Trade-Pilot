//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'feedback_body.g.dart';

/// FeedbackBody
///
/// Properties:
/// * [feedbackType] 
/// * [outcome] 
/// * [note] 
@BuiltValue()
abstract class FeedbackBody implements Built<FeedbackBody, FeedbackBodyBuilder> {
  @BuiltValueField(wireName: r'feedbackType')
  FeedbackBodyFeedbackTypeEnum get feedbackType;
  // enum feedbackTypeEnum {  useful,  not_useful,  };

  @BuiltValueField(wireName: r'outcome')
  FeedbackBodyOutcomeEnum? get outcome;
  // enum outcomeEnum {  correct,  wrong,  unknown,  };

  @BuiltValueField(wireName: r'note')
  String? get note;

  FeedbackBody._();

  factory FeedbackBody([void updates(FeedbackBodyBuilder b)]) = _$FeedbackBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FeedbackBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FeedbackBody> get serializer => _$FeedbackBodySerializer();
}

class _$FeedbackBodySerializer implements PrimitiveSerializer<FeedbackBody> {
  @override
  final Iterable<Type> types = const [FeedbackBody, _$FeedbackBody];

  @override
  final String wireName = r'FeedbackBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FeedbackBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'feedbackType';
    yield serializers.serialize(
      object.feedbackType,
      specifiedType: const FullType(FeedbackBodyFeedbackTypeEnum),
    );
    if (object.outcome != null) {
      yield r'outcome';
      yield serializers.serialize(
        object.outcome,
        specifiedType: const FullType(FeedbackBodyOutcomeEnum),
      );
    }
    if (object.note != null) {
      yield r'note';
      yield serializers.serialize(
        object.note,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    FeedbackBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FeedbackBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'feedbackType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FeedbackBodyFeedbackTypeEnum),
          ) as FeedbackBodyFeedbackTypeEnum;
          result.feedbackType = valueDes;
          break;
        case r'outcome':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(FeedbackBodyOutcomeEnum),
          ) as FeedbackBodyOutcomeEnum?;
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
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FeedbackBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FeedbackBodyBuilder();
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

class FeedbackBodyFeedbackTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'useful')
  static const FeedbackBodyFeedbackTypeEnum useful = _$feedbackBodyFeedbackTypeEnum_useful;
  @BuiltValueEnumConst(wireName: r'not_useful')
  static const FeedbackBodyFeedbackTypeEnum notUseful = _$feedbackBodyFeedbackTypeEnum_notUseful;

  static Serializer<FeedbackBodyFeedbackTypeEnum> get serializer => _$feedbackBodyFeedbackTypeEnumSerializer;

  const FeedbackBodyFeedbackTypeEnum._(String name): super(name);

  static BuiltSet<FeedbackBodyFeedbackTypeEnum> get values => _$feedbackBodyFeedbackTypeEnumValues;
  static FeedbackBodyFeedbackTypeEnum valueOf(String name) => _$feedbackBodyFeedbackTypeEnumValueOf(name);
}

class FeedbackBodyOutcomeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'correct')
  static const FeedbackBodyOutcomeEnum correct = _$feedbackBodyOutcomeEnum_correct;
  @BuiltValueEnumConst(wireName: r'wrong')
  static const FeedbackBodyOutcomeEnum wrong = _$feedbackBodyOutcomeEnum_wrong;
  @BuiltValueEnumConst(wireName: r'unknown')
  static const FeedbackBodyOutcomeEnum unknown = _$feedbackBodyOutcomeEnum_unknown;

  static Serializer<FeedbackBodyOutcomeEnum> get serializer => _$feedbackBodyOutcomeEnumSerializer;

  const FeedbackBodyOutcomeEnum._(String name): super(name);

  static BuiltSet<FeedbackBodyOutcomeEnum> get values => _$feedbackBodyOutcomeEnumValues;
  static FeedbackBodyOutcomeEnum valueOf(String name) => _$feedbackBodyOutcomeEnumValueOf(name);
}


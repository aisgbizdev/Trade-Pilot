//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'feedback_with_details.g.dart';

/// FeedbackWithDetails
///
/// Properties:
/// * [id] 
/// * [analysisId] 
/// * [instrument] 
/// * [userId] 
/// * [userEmail] 
/// * [feedbackType] 
/// * [outcome] 
/// * [note] 
/// * [createdAt] 
@BuiltValue()
abstract class FeedbackWithDetails implements Built<FeedbackWithDetails, FeedbackWithDetailsBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'analysisId')
  int get analysisId;

  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'userId')
  int get userId;

  @BuiltValueField(wireName: r'userEmail')
  String get userEmail;

  @BuiltValueField(wireName: r'feedbackType')
  FeedbackWithDetailsFeedbackTypeEnum get feedbackType;
  // enum feedbackTypeEnum {  useful,  not_useful,  };

  @BuiltValueField(wireName: r'outcome')
  FeedbackWithDetailsOutcomeEnum? get outcome;
  // enum outcomeEnum {  correct,  wrong,  unknown,  };

  @BuiltValueField(wireName: r'note')
  String? get note;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  FeedbackWithDetails._();

  factory FeedbackWithDetails([void updates(FeedbackWithDetailsBuilder b)]) = _$FeedbackWithDetails;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FeedbackWithDetailsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FeedbackWithDetails> get serializer => _$FeedbackWithDetailsSerializer();
}

class _$FeedbackWithDetailsSerializer implements PrimitiveSerializer<FeedbackWithDetails> {
  @override
  final Iterable<Type> types = const [FeedbackWithDetails, _$FeedbackWithDetails];

  @override
  final String wireName = r'FeedbackWithDetails';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FeedbackWithDetails object, {
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
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'userEmail';
    yield serializers.serialize(
      object.userEmail,
      specifiedType: const FullType(String),
    );
    yield r'feedbackType';
    yield serializers.serialize(
      object.feedbackType,
      specifiedType: const FullType(FeedbackWithDetailsFeedbackTypeEnum),
    );
    if (object.outcome != null) {
      yield r'outcome';
      yield serializers.serialize(
        object.outcome,
        specifiedType: const FullType(FeedbackWithDetailsOutcomeEnum),
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
    FeedbackWithDetails object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FeedbackWithDetailsBuilder result,
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
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'userEmail':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userEmail = valueDes;
          break;
        case r'feedbackType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FeedbackWithDetailsFeedbackTypeEnum),
          ) as FeedbackWithDetailsFeedbackTypeEnum;
          result.feedbackType = valueDes;
          break;
        case r'outcome':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(FeedbackWithDetailsOutcomeEnum),
          ) as FeedbackWithDetailsOutcomeEnum?;
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
  FeedbackWithDetails deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FeedbackWithDetailsBuilder();
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

class FeedbackWithDetailsFeedbackTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'useful')
  static const FeedbackWithDetailsFeedbackTypeEnum useful = _$feedbackWithDetailsFeedbackTypeEnum_useful;
  @BuiltValueEnumConst(wireName: r'not_useful')
  static const FeedbackWithDetailsFeedbackTypeEnum notUseful = _$feedbackWithDetailsFeedbackTypeEnum_notUseful;

  static Serializer<FeedbackWithDetailsFeedbackTypeEnum> get serializer => _$feedbackWithDetailsFeedbackTypeEnumSerializer;

  const FeedbackWithDetailsFeedbackTypeEnum._(String name): super(name);

  static BuiltSet<FeedbackWithDetailsFeedbackTypeEnum> get values => _$feedbackWithDetailsFeedbackTypeEnumValues;
  static FeedbackWithDetailsFeedbackTypeEnum valueOf(String name) => _$feedbackWithDetailsFeedbackTypeEnumValueOf(name);
}

class FeedbackWithDetailsOutcomeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'correct')
  static const FeedbackWithDetailsOutcomeEnum correct = _$feedbackWithDetailsOutcomeEnum_correct;
  @BuiltValueEnumConst(wireName: r'wrong')
  static const FeedbackWithDetailsOutcomeEnum wrong = _$feedbackWithDetailsOutcomeEnum_wrong;
  @BuiltValueEnumConst(wireName: r'unknown')
  static const FeedbackWithDetailsOutcomeEnum unknown = _$feedbackWithDetailsOutcomeEnum_unknown;

  static Serializer<FeedbackWithDetailsOutcomeEnum> get serializer => _$feedbackWithDetailsOutcomeEnumSerializer;

  const FeedbackWithDetailsOutcomeEnum._(String name): super(name);

  static BuiltSet<FeedbackWithDetailsOutcomeEnum> get values => _$feedbackWithDetailsOutcomeEnumValues;
  static FeedbackWithDetailsOutcomeEnum valueOf(String name) => _$feedbackWithDetailsOutcomeEnumValueOf(name);
}


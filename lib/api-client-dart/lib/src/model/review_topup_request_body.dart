//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'review_topup_request_body.g.dart';

/// ReviewTopupRequestBody
///
/// Properties:
/// * [status] 
/// * [creditsGranted] 
/// * [reviewNote] 
@BuiltValue()
abstract class ReviewTopupRequestBody implements Built<ReviewTopupRequestBody, ReviewTopupRequestBodyBuilder> {
  @BuiltValueField(wireName: r'status')
  ReviewTopupRequestBodyStatusEnum get status;
  // enum statusEnum {  approved,  rejected,  };

  @BuiltValueField(wireName: r'creditsGranted')
  int? get creditsGranted;

  @BuiltValueField(wireName: r'reviewNote')
  String? get reviewNote;

  ReviewTopupRequestBody._();

  factory ReviewTopupRequestBody([void updates(ReviewTopupRequestBodyBuilder b)]) = _$ReviewTopupRequestBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ReviewTopupRequestBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ReviewTopupRequestBody> get serializer => _$ReviewTopupRequestBodySerializer();
}

class _$ReviewTopupRequestBodySerializer implements PrimitiveSerializer<ReviewTopupRequestBody> {
  @override
  final Iterable<Type> types = const [ReviewTopupRequestBody, _$ReviewTopupRequestBody];

  @override
  final String wireName = r'ReviewTopupRequestBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ReviewTopupRequestBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'status';
    yield serializers.serialize(
      object.status,
      specifiedType: const FullType(ReviewTopupRequestBodyStatusEnum),
    );
    if (object.creditsGranted != null) {
      yield r'creditsGranted';
      yield serializers.serialize(
        object.creditsGranted,
        specifiedType: const FullType(int),
      );
    }
    if (object.reviewNote != null) {
      yield r'reviewNote';
      yield serializers.serialize(
        object.reviewNote,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    ReviewTopupRequestBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ReviewTopupRequestBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'status':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(ReviewTopupRequestBodyStatusEnum),
          ) as ReviewTopupRequestBodyStatusEnum;
          result.status = valueDes;
          break;
        case r'creditsGranted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.creditsGranted = valueDes;
          break;
        case r'reviewNote':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.reviewNote = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ReviewTopupRequestBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ReviewTopupRequestBodyBuilder();
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

class ReviewTopupRequestBodyStatusEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'approved')
  static const ReviewTopupRequestBodyStatusEnum approved = _$reviewTopupRequestBodyStatusEnum_approved;
  @BuiltValueEnumConst(wireName: r'rejected')
  static const ReviewTopupRequestBodyStatusEnum rejected = _$reviewTopupRequestBodyStatusEnum_rejected;

  static Serializer<ReviewTopupRequestBodyStatusEnum> get serializer => _$reviewTopupRequestBodyStatusEnumSerializer;

  const ReviewTopupRequestBodyStatusEnum._(String name): super(name);

  static BuiltSet<ReviewTopupRequestBodyStatusEnum> get values => _$reviewTopupRequestBodyStatusEnumValues;
  static ReviewTopupRequestBodyStatusEnum valueOf(String name) => _$reviewTopupRequestBodyStatusEnumValueOf(name);
}

